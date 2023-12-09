/**
 *
 * перегрузка типов на случай если keyOrPath extends `_._`
 * и для mapTo тоже перегрузка
 * createDict(arr, keyOrPath, mapTo?)
 *
 * Вопросы:
 * 1. позволять ли, чтобы keyOrPath был undefined? Думаю, да - ну будет undefined ключ. Только разрешен должен быть
 * undefined только на последнем сегменте
 * 2. mapTo - аналогично
 *
 */