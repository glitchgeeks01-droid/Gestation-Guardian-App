// @ts-nocheck
export async function queryAI(userMessage: string): Promise<string> {
    const text = userMessage.toLowerCase();
    let response = "Based on clinical guidelines, I'd recommend discussing this with your doctor at your next visit.";

    if (text.includes('iron') || text.includes('diet') || text.includes('food')) {
        response = "A balanced diet is crucial during pregnancy! Excellent sources of iron include lean red meat, poultry, beans, lentils, spinach, and iron-fortified cereals. Remember to pair iron-rich foods with vitamin C for better absorption.";
    } else if (text.includes('sleep')) {
        response = "Sleeping on your left side (SOS) is highly recommended during the second and third trimesters as it improves blood flow to the placenta and your baby. Try using a pregnancy pillow for extra support!";
    } else if (text.includes('kick') || text.includes('movement')) {
        response = "Tracking baby kicks is a great way to monitor your baby's well-being. You should generally feel about 10 movements within 2 hours. If you notice a significant decrease, contact your healthcare provider immediately.";
    } else if (text.includes('blood pressure') || text.includes('bp')) {
        response = "Monitoring blood pressure is important to watch for signs of preeclampsia. A normal reading is typically around 120/80. If it consistently reads higher than 140/90, please consult your doctor.";
    } else if (text.includes('contraction') || text.includes('labor')) {
        response = "Braxton Hicks (practice contractions) are normal and usually irregular. True labor contractions will become closer together, stronger, and more regular. If you're unsure or before 37 weeks, always call your provider.";
    } else if (text.includes('nausea') || text.includes('morning sickness')) {
        response = "Nausea is very common, especially in the first trimester. Try eating small, frequent meals, keeping crackers by your bed, and staying hydrated. Ginger and vitamin B6 can also help.";
    }

    // Simulate network latency (1 to 2 seconds)
    const delay = Math.floor(Math.random() * 1000) + 1000;
    return new Promise((resolve) => setTimeout(() => resolve(response), delay));
}
