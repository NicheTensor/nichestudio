export const maxDuration = 60; 

export async function POST(request) {
  const data = await request.json()
  try {
    const response = await fetch('http://proxy_client_nicheimage.nichetensor.com:10003/generate', {
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
    return Response.json({ error: 'An error occurred while generating the image' }, { status: 500 });
  }
}