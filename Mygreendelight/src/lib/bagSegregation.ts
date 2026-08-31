export interface SegregatedBags {
  bag1_leafy: { name: string; quantity: number; unit?: string }[];
  bag2_heavy: { name: string; quantity: number; unit?: string }[];
  bag3_dairy: { name: string; quantity: number; unit?: string }[];
}

export function segregateOrderProduce(items: any[] = []): SegregatedBags {
  const bag1: { name: string; quantity: number; unit?: string }[] = [];
  const bag2: { name: string; quantity: number; unit?: string }[] = [];
  const bag3: { name: string; quantity: number; unit?: string }[] = [];

  items.forEach((item) => {
    const name = (item.name || "").toLowerCase();
    const cat = (item.category || "").toLowerCase();

    if (
      cat.includes("dairy") ||
      name.includes("milk") ||
      name.includes("doodh") ||
      name.includes("paneer") ||
      name.includes("curd") ||
      name.includes("dahi") ||
      name.includes("butter") ||
      name.includes("cheese")
    ) {
      bag3.push({ name: item.name, quantity: item.quantity || 1, unit: item.unit });
    } else if (
      name.includes("palak") ||
      name.includes("spinach") ||
      name.includes("methi") ||
      name.includes("dhaniya") ||
      name.includes("coriander") ||
      name.includes("pudina") ||
      name.includes("mint") ||
      name.includes("tamatar") ||
      name.includes("tomato") ||
      name.includes("lettuce") ||
      name.includes("salad") ||
      name.includes("mushroom") ||
      name.includes("strawberry")
    ) {
      bag1.push({ name: item.name, quantity: item.quantity || 1, unit: item.unit });
    } else {
      bag2.push({ name: item.name, quantity: item.quantity || 1, unit: item.unit });
    }
  });

  return {
    bag1_leafy: bag1,
    bag2_heavy: bag2,
    bag3_dairy: bag3,
  };
}
