import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '10s', target: 100 },  // Normal load
    { duration: '1m', target: 1000 },  // Sudden spike to 1000
    { duration: '10s', target: 100 },  // Scale down quickly
  ],
};

export default function () {
  const res = http.get('https://gdgvitb.in/');
  
  // Verify that the page loaded successfully
  check(res, {
    'status is 200': (r) => r.status === 200,
  });

  sleep(1); // Wait for 1 second between actions
}
