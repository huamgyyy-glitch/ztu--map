export const asset = (group: string, name: string) =>
  `/assets/${group}/${encodeURIComponent(name)}`;

export const cardPhoto = (name: string) => asset("cards", name);
export const commonAsset = (name: string) => asset("common", name);
export const mapAsset = (name: string) => asset("map", name);
export const foodAsset = (name: string) => asset("food", name);
export const architectureAsset = (name: string) => asset("architecture", name);
export const cinemaAsset = (name: string) => asset("cinema", name);
export const homeAsset = (name: string) => asset("home", name);
