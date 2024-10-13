export function setupWebSocketClient(url) {
    let retries = 0;
    const maxRetries = 5;
    const retryInterval = 2000; // 2 seconds

    function connect() {
        const socket = new WebSocket(url);

        socket.onopen = () => {
            console.log('WebSocket connection established');
            retries = 0; // Reset retries on successful connection
        };

        socket.onmessage = (event) => {
            console.log('Message from server:', event.data);
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
            if (retries < maxRetries) {
                retries++;
                console.log(`Retrying connection in ${retryInterval / 1000} seconds... (Attempt ${retries}/${maxRetries})`);
                setTimeout(connect, retryInterval);
            } else {
                alert('WebSocket connection failed after multiple attempts. Please ensure the server is running.');
            }
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }

    connect();
}