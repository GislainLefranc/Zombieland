// T c'est pour passer un type défini au moment du typage
export interface SelectOptionItem<T> {
  name: string;
  value: T; // Generic type (No need to specify a particular type)
}
