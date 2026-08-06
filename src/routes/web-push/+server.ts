import { json } from "@sveltejs/kit";

export function POST({ request }) {
  // handle post to subscribe user notifications
  if (!request.body || !request.body.endpoint) {
    return json(null, { status: 400, statusText: 'Subscription endpoint missing.' });
  }

  const saveSubToDb = () => {

  }
}
