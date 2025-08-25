import axios from "axios";

export const processLinkedInData = async (profileData) => {
    const response = await axios.post("https://api.groq.com/v1/analyze", {
        apiKey: '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',
        data: profileData,
    });

    return response.data;
};
