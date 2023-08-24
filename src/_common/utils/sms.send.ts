import * as crypto from 'crypto';
import { IMessage } from '../interfaces/message.interface';
import { HttpException } from '@nestjs/common';

export const smsSend = async (phone, requestMessage): Promise<string> => {
  const message = [];
  const accessKey = process.env.SMS_ACCESS_KEY;
  const secretKey = process.env.SMS_SECRET_KEY;

  const hmac = crypto.createHmac('sha256', secretKey);

  const url = process.env.SMS_URL;
  const uri = process.env.SMS_URI;
  const method = 'POST';
  const space = ' ';
  const newLine = '\n';
  const timestamp = Date.now().toString();

  message.push(method);
  message.push(space);
  message.push(uri);
  message.push(newLine);
  message.push(timestamp);
  message.push(newLine);
  message.push(accessKey);

  const signature = hmac.update(message.join('')).digest('base64').toString();
  const api = await fetch(url + uri, {
    method,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'x-ncp-apigw-timestamp': timestamp,
      'x-ncp-iam-access-key': accessKey,
      'x-ncp-apigw-signature-v2': signature,
    },
    body: JSON.stringify({
      type: 'SMS',
      contentType: 'COMM',
      countryCode: '82',
      from: process.env.SMS_FROM_NUMBER,
      content: requestMessage,
      messages: [
        {
          to: phone.replaceAll('-', ''),
        },
      ],
    }),
  });

  const result = await api.json();
  if (result.statusCode !== '202') throw new HttpException('인증번호 발송에 실패하였습니다.\n관리자에게 문의해 주세요.', 403);

  return '인증번호가 정상 발송되었습니다.';
};
