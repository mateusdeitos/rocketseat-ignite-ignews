import { NextApiRequest, NextApiResponse } from 'next';
export default (request: NextApiRequest, response: NextApiResponse) => {
    console.log(request.query);
    const users = [
        { id: 1, name: 'Mateus' },
        { id: 2, name: 'Amanda' },
        { id: 3, name: 'Guilherme' }
    ]

    return response.json(users);
}