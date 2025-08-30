// import ProductPage from "@/components/productPage";

// export default async function Page({ params }: { params: { id: string } }) {
//   return <ProductPage id={params.id} />;
// }
import ProductPage from "@/components/productPage";

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  return <ProductPage id={id} />;
}
