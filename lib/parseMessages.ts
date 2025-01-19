export function parseMessages(messages: string[]) {
    const labels = [
        'Gender', 'Height', 'Age', 'Build', 'Beard', 'Hijab/Niqab', 'Born Muslim or Revert',
        'Nationality', 'Ethnicity', 'Occupation', 'Education', 'Languages spoken', 'Would you consider Polygamy',
        'Do you pray 5xs a day?', 'Marital status', 'Do you have children from previous marriage?',
        'Which country are you currently residing in?', 'Which countries you would consider moving to?',
        'Brief description about you \\(maximum 150 words\\)\\*', 'Your preference'
    ];

    const extractField = (text: string, start: string, end: string) => {
        const startIdx = text.indexOf(start);
        const endIdx = end ? text.indexOf(end) : text.length;
        return startIdx >= 0 ? text.slice(startIdx + start.length, endIdx).trim() : null;
    };

    const sanitize = (value: string | null) => {
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

