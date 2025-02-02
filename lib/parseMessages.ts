export function parseMessages(messages: string[]) {
    const labels = [
        'Marital status', 'Do you have children from previous marriage?', 'Nationality',
        'Which country are you currently residing in?', 'Which countries you would consider moving to?',
        'Languages spoken', 'Beard', 'Hijab/Niqab', 'Ethnicity', 'Gender', 'Height', 'Build',
        'Age', 'Do you pray 5xs a day?', 'Born Muslim or Revert', 'Sect', 'Name of Masjid', 'Scholars/speakers you listen to',
        'Education', 'Islamic Education', 'Occupation',
        'Would you consider Polygamy',
        'Brief description about you', 'Your preference'
    ];

    const extractField = (text: string, start: string, end: string) => {
        const startIdx = text.indexOf(start);
        const endIdx = end ? text.indexOf(end) : text.length;
        return startIdx >= 0 ? text.slice(startIdx + start.length, endIdx).trim() : null;
    };

    const sanitize = (value: string | null) => {
        if (value?.includes("\\(maximum 150 words\\) \\*)")) {
            return value.replace("\\(maximum 150 words\\)\\*", '').trim() || '';
        }
        return value?.replace(/^[:\-\?\s]+|[:\-\?\s]+$/g, '').trim() || '';
    };

    return messages.map(message => {
        const data: Record<string, string> = {};

        labels.forEach((label, index) => {
            const nextLabel = labels[index + 1] || '';
            const value = extractField(message, label, nextLabel);
            data[label] = sanitize(value);
        });

        // Extract ID separately
        const idMatch = message.match(/ID\s+(\d+)/);
        if (idMatch) {
            data.id = idMatch[1];
        }

        console.log(JSON.stringify(data, null, 2));
        return data;
    });
}

