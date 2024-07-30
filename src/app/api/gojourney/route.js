export async function POST(request) {
  const data = await request.json()
  try {
    const response = await fetch('https://api.midjourneyapi.xyz/mj/v2/fetch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });
    const responseData = await response.json();
    return Response.json(responseData);
  } catch (error) {
    console.error('Error:', error);
  }
}