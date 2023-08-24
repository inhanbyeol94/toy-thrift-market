import { Injectable } from '@nestjs/common';
import { WebClient } from '@slack/web-api';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SlackService {
  private web: WebClient;

  constructor(private configService: ConfigService) {
    const token = this.configService.get<string>('SLACK_BOT_TOKEN');
    this.web = new WebClient(token);
  }

  async sendSlackMessage(message: string): Promise<void> {
    try {
      const result = await this.web.chat.postMessage({
        channel: 'C05PUUANS3S',
        text: message,
      });

      console.log('Message sent: ', result.ts);
    } catch (error) {
      console.error('Error sending message to Slack: ', error);
    }
  }
}
