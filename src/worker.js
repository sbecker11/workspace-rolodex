self.onmessage = function(event) {
    // Perform heavy computation
    const result = heavyComputation(event.data);
    self.postMessage(result);
  };
  
  function heavyComputation(data) {
    // Your heavy computation logic here
    return data;
  }