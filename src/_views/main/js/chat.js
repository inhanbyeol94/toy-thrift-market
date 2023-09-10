<html>
  <head>
    <script>
    const socket = io('http://localhost:5000');
      socket.onopen = function() {
        console.log('Connected');
        socket.send(
          JSON.stringify({
            event: 'events',
            data: 'test',
          }),
        );
        socket.onmessage = function(data) {
          console.log(data);
        };
      };
    </script>
  </head>

  <body></body>
</html>