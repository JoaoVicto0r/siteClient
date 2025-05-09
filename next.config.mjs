/** @type {import('next').NextConfig} */
const nextConfig = {
  // Desabilitar a geração estática para todo o projeto
  output: 'standalone',
  
  // Configurações adicionais
  experimental: {
    // Habilitar o middleware para autenticação
    serverActions: true,
  },

  // Aumentar o tempo limite para operações de banco de dados
  serverRuntimeConfig: {
    // Tempo limite de 30 segundos para operações do servidor
    requestTimeout: 30000,
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Configurações de imagens
  images: {
    domains: ['placeholder.com'],
    unoptimized: true,
  },
};

export default nextConfig;
