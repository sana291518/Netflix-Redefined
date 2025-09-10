import express from 'express';
import cors from 'cors';
import axios from 'axios';
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

// FastAPI microservice URLs from environment variables
const RECOMMEND_URL = process.env.RECOMMEND_URL || 'http://localhost:8000/skills/recommend/recommend';
const ACTOR_INFO_URL = process.env.ACTOR_INFO_URL || 'http://localhost:8000/skills/actor_info/actor_info';
const CO_ACTOR_URL = process.env.CO_ACTOR_URL || 'http://localhost:8000/skills/co_actor/co_actor';
const SHOW_DETAILS_URL = process.env.SHOW_DETAILS_URL || 'http://localhost:8000/skills/show_details/show_details';

app.use(express.json());
app.use(cors());

app.post('/api/chat', async (req, res) => {
  const { text, intent, params } = req.body; // frontend sends text, detected intent, and params

  try {
    let responseData = {};
    // Route request based on intent
    switch (intent) {
      case 'recommend':
        responseData = (await axios.get(RECOMMEND_URL, { params })).data;
        break;
      case 'actor_info':
        responseData = (await axios.get(ACTOR_INFO_URL, { params })).data;
        break;
      case 'co_actor':
        responseData = (await axios.get(CO_ACTOR_URL, { params })).data;
        break;
      case 'show_details':
        responseData = (await axios.get(SHOW_DETAILS_URL, { params })).data;
        break;
      default:
        return res.status(400).json({ error: 'Unknown intent' });
    }
    res.json({ result: responseData });
  } catch (error) {
    console.error('API Gateway error:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`API Gateway server listening at http://localhost:${PORT}`);
});
