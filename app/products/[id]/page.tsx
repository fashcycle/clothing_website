import ProductPage from "@/components/productPage";

export default async function Page({ params }: { params: { id: string } }) {
  return <ProductPage id={params.id} />;
}
