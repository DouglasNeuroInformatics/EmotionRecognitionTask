import { createConfig } from '@douglasneuroinformatics/prettier-config';

export default createConfig({
  cssDeclarationSorterOrder: 'alphabetical',
  plugins: ['prettier-plugin-css-order']
});
