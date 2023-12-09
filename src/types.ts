/*
 * Возвращает union ключей T, в которых лежат value с типом K
 * */
export type GetNames<T extends object, K> = {
  [Key in keyof T]: T[Key] extends K ? Key : never
}[keyof T]
