async function verifyGHOauthToken(access_token, res) {
    try {
        const response = await fetch('https://api.github.com/user', {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${access_token}`,
                'X-GitHub-Api-Version': '2022-11-28'
            },
        });

        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Error verifying GitHub token');
    }
}

module.exports = { verifyGHOauthToken };
