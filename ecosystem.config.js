module.exports = {
    apps: [
      {
        name: 'togo',
        exec_mode: 'cluster',
        instances: 'max', // Or a number of instances
        script: 'server.js',
        args: 'start',
        env: {
            NODE_ENV: 'production',
            PORT: 8000 // Or your preferred port
          },
        exp_backoff_restart_delay: 100, // optional, adjust as needed
   //     watch: true, // optional, adjust as needed
     //   max_memory_restart: '400M' // optional, adjust as needed
      }
    ]
  }