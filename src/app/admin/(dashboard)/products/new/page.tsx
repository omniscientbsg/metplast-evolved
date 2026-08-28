import { ProductForm } from '../ProductForm';

export const dynamic = 'force-dynamic';

export default function NewProductPage() {
  return <ProductForm mode="create" />;
}
