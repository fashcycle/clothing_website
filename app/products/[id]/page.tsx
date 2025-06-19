
import ProductPage from "@/components/productPage"; // adjust if needed

export default function Page({ params }: { params: { id: any } }) {
  return <ProductPage id={params.id} />;
}
