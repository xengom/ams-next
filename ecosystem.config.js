module.exports = {
  apps: [
    {
      name: 'ams-next',
      script: 'pnpm',
      args: 'start',
      env_development: {
        NODE_ENV: 'development',
        PORT: 3000,
        instances: '1',
        env_file: '.env.development'
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000,
        instances: '2',
        env_file: '.env.production'
      },
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
    }
  ]
} 