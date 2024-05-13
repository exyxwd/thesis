import { startDevServer } from '@cypress/vite-dev-server';
import viteConfig from '../../vite.config';

export default (on, config) => {
  on('dev-server:start', options => startDevServer({ options, viteConfig }));
  return config;
};