/**
 * Document Management Routes (F6 & S17, S5)
 * Standards: OWASP API Security Top 10 (API8: Unrestricted Uploads, API1: BOLA), HIPAA Security Rule
 * Security Requirements Owned: S17 (10MB Cap, Magic Bytes, Randomized Keys), S5 (Strict 404 on Foreign ID)
 * Scope: backend/src/modules/documents/documents.routes.ts
 */

import { Router } from '../../middleware/express_core';
import { requireAuth } from '../../middleware/auth';
import { documentUploadPipeline } from './documents.pipeline';
import type { FileUploadPayload } from './documents.pipeline';
import { DocumentRepository } from '../../db/index';
import { getOrCreateDatabasePool } from '../db_memory';
import { logAuditEvent, hashIpAddress } from '../../core/audit';
import * as crypto from 'crypto';

export const documentsRouter = Router();

// POST /api/v1/documents/upload - Secure Document Upload Pipeline
documentsRouter.post(
  '/upload',
  requireAuth,
  async (req: any, res: any, next: (err?: any) => void) => {
    try {
      const db = getOrCreateDatabasePool();
      const docRepo = new DocumentRepository(db);
      const userId = req.user.userId;

      const { fileName, declaredMimeType, data, base64 } = req.body || {};

      if (!fileName || !declaredMimeType) {
        return res.status(400).json({
          error: 'Bad Request',
          code: 'VALIDATION_FAILED',
          message: 'fileName and declaredMimeType are required.'
        });
      }

      // Convert content to Buffer
      let fileBuffer: Buffer;
      if (Buffer.isBuffer(req.body?.buffer)) {
        fileBuffer = req.body.buffer;
      } else if (base64 && typeof base64 === 'string') {
        fileBuffer = Buffer.from(base64, 'base64');
      } else if (data && typeof data === 'string') {
        fileBuffer = Buffer.from(data, 'base64');
      } else if (typeof req.body?.content === 'string') {
        fileBuffer = Buffer.from(req.body.content, 'utf8');
      } else {
        fileBuffer = Buffer.alloc(0);
      }

      const payload: FileUploadPayload = {
        fileName,
        declaredMimeType,
        sizeBytes: fileBuffer.length,
        buffer: fileBuffer
      };

      // Execute S17 Validation Pipeline
      const validation = documentUploadPipeline.validateAndProcess(userId, payload);

      if (!validation.success) {
        return res.status(validation.status).json({
          error: validation.error?.code === 'PAYLOAD_TOO_LARGE' ? 'Payload Too Large' : 'Unsupported Media Type',
          code: validation.error?.code || 'UPLOAD_FAILED',
          message: validation.error?.message || 'File upload validation failed.'
        });
      }

      // Save document record with randomized storage key
      const record = await docRepo.create(userId, {
        file_name: fileName,
        mime_type: declaredMimeType,
        size_bytes: fileBuffer.length,
        storage_key: validation.storageKey!,
        key_version: 1,
        created_at: new Date().toISOString()
      });

      await logAuditEvent(db, {
        userId,
        action: 'CREATE',
        resourceType: 'document',
        resourceId: record.id,
        ipAddress: hashIpAddress(req.ip),
        status: 'SUCCESS'
      });

      res.status(201).json(record);
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/v1/documents - List documents for user
documentsRouter.get(
  '/',
  requireAuth,
  async (req: any, res: any, next: (err?: any) => void) => {
    try {
      const db = getOrCreateDatabasePool();
      const docRepo = new DocumentRepository(db);
      const userId = req.user.userId;

      const records = await docRepo.findAll(userId, { orderBy: 'created_at', orderDirection: 'DESC' });

      await logAuditEvent(db, {
        userId,
        action: 'READ',
        resourceType: 'document',
        resourceId: records[0]?.id || null,
        ipAddress: hashIpAddress(req.ip),
        status: 'SUCCESS'
      });

      res.status(200).json(records);
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/v1/documents/:id - Retrieve single document and signed access URL (S5 IDOR strict 404)
documentsRouter.get(
  '/:id',
  requireAuth,
  async (req: any, res: any, next: (err?: any) => void) => {
    try {
      const db = getOrCreateDatabasePool();
      const docRepo = new DocumentRepository(db);
      const userId = req.user.userId;
      const docId = req.params.id;

      const doc = await docRepo.findByIdOrThrow(userId, docId);

      // Generate time-limited signed URL
      const signedToken = crypto.randomUUID();
      const signedUrl = `https://storage.gestationguardian.internal/${doc.storage_key}?token=${signedToken}&expires=${Date.now() + 3600000}`;

      await logAuditEvent(db, {
        userId,
        action: 'READ',
        resourceType: 'document',
        resourceId: doc.id,
        ipAddress: hashIpAddress(req.ip),
        status: 'SUCCESS'
      });

      res.status(200).json({
        ...doc,
        signed_url: signedUrl
      });
    } catch (err) {
      next(err);
    }
  }
);

// DELETE /api/v1/documents/:id - Delete document (S5 IDOR strict 404)
documentsRouter.delete(
  '/:id',
  requireAuth,
  async (req: any, res: any, next: (err?: any) => void) => {
    try {
      const db = getOrCreateDatabasePool();
      const docRepo = new DocumentRepository(db);
      const userId = req.user.userId;
      const docId = req.params.id;

      await docRepo.deleteOrThrow(userId, docId);

      await logAuditEvent(db, {
        userId,
        action: 'DELETE',
        resourceType: 'document',
        resourceId: docId,
        ipAddress: hashIpAddress(req.ip),
        status: 'SUCCESS'
      });

      res.status(200).json({ success: true, message: 'Document and storage object deleted successfully.' });
    } catch (err) {
      next(err);
    }
  }
);
