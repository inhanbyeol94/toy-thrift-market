import { WebClient } from '@slack/web-api';

const token = process.env.BOT_TOKEN;
const web = new WebClient(token);

export async function sendSlackMessage(message: string) {
  try {
    const result = await web.chat.postMessage({
      channel: '#general', // 메시지를 보낼 채널 이름
      text: message,
    });

    console.log('Message sent: ', result.ts);
  } catch (error) {
    console.error('Error sending message to Slack: ', error);
  }
}
