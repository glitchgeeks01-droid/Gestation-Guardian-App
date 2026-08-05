
export const toUserViewModel = (apiData: any) => {
    return { ...apiData, mappedAt: Date.now() };
};
