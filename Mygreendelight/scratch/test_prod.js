async function testProd() {
  const res = await fetch("https://mygreendelight.vercel.app/api/admin/manageorder");
  console.log("Status:", res.status);
  const data = await res.json();
  console.log("Success:", data.success);
  console.log("Orders count:", data.orders?.length);
  if (data.message) console.log("Message:", data.message);
  if (data.orders?.length > 0) {
    console.log("Sample order ID:", data.orders[0]._id);
  }
}
testProd().catch(console.error);
