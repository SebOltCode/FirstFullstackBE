
import http from 'http';
import { createPost, deletePost, getPosts, getPostById, updatePost } from './crudOperations.js';
import { regex, returnErrorWithMessage } from './utils.js';

const resource = '/posts';

const requestHandler = async (req, res) => {
  const { method, url } = req;
  if (url === resource) {
    if (method === 'GET') return await getPosts(req, res);
    if (method === 'POST') return await createPost(req, res);
    else return returnErrorWithMessage(res, 405, 'Method Not Allowed');
  } else if (regex(resource).test(url)) {
    if (method === 'GET') return await getPostById(req, res);
    if (method === 'PUT') return await updatePost(req, res);
    if (method === 'DELETE') return await deletePost(req, res);
    else return returnErrorWithMessage(res, 405, 'Method Not Allowed');
  } else {
    return returnErrorWithMessage(res, 404, 'Resource Not Found');
  }
};

const server = http.createServer(requestHandler);

const port = 3000;
server.listen(port, () => console.log(`Server running at http://localhost:${port}`));