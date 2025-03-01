import axios from 'axios';

export const generateZoomAccessToken = async () => {
    try {
        const accountId = 'GDc19ghmQOqmpvrv4SQmpQ';
        const clientId = '8IO3ERwDTtdXzUNXfk9KQ';
        const clientSecret = 'ZwJ1fIU1edmPr5UjBXxzRvn40VN9godC';
        const response = await axios.post(`https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`,
            { },
            {
                headers: {
                    'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
                }
            }
        );
        return response.data.access_token;
    } catch (error) {
        console.error('Error generating Zoom access token:', error);
        throw new Error('Error generating Zoom access token');
    }
};