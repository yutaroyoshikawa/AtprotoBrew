---
name: padding-line-between-statements
description: ステートメント間の空行ルール。return・throw の前、ブロック文の前後、変数宣言グループの境界に空行を入れる。Biome は自動修正しないため手動で順守する。
---

# padding-line-between-statements

Biome にはこのルールの自動修正がないため、**コードを書く時点で**空行を正しく入れる。

## 基本ルール

### 1. `return` / `throw` の前には必ず空行

```typescript
// ❌
function getLabel(item: Item): string {
  const label = item.name.trim();
  return label;
}

// ✅
function getLabel(item: Item): string {
  const label = item.name.trim();

  return label;
}
```

```typescript
// ❌
function validate(value: unknown): string {
  if (typeof value !== "string") {
    throw new Error("expected string");
  }
  return value;
}

// ✅
function validate(value: unknown): string {
  if (typeof value !== "string") {
    throw new Error("expected string");
  }

  return value;
}
```

例外: 関数の最初のステートメントが `return` / `throw` の場合は空行不要。

```typescript
// ✅ 最初のステートメントなので空行不要
function noop() {
  return null;
}
```

---

### 2. ブロック文（`if` / `for` / `while` / `try` など）の前後に空行

```typescript
// ❌
const items = getItems();
if (items.length === 0) {
  return [];
}
const result = process(items);

// ✅
const items = getItems();

if (items.length === 0) {
  return [];
}

const result = process(items);
```

例外: ブロックが関数の最初のステートメントの場合は前の空行不要。

```typescript
// ✅
function process(items: Item[]) {
  if (items.length === 0) {
    return [];
  }

  return items.map(transform);
}
```

---

### 3. 変数宣言グループの後に空行（次が変数宣言でない場合）

同じ種類の変数宣言が連続する場合は空行を入れない。別の種類のステートメントが来る場合は空行を入れる。

```typescript
// ❌ 変数宣言の直後に処理が来ている
const width = dimensions.width;
const height = dimensions.height;
const area = width * height;
doSomething(area);

// ✅
const width = dimensions.width;
const height = dimensions.height;
const area = width * height;

doSomething(area);
```

```typescript
// ✅ 変数宣言が連続する場合は空行不要
const a = 1;
const b = 2;
const c = a + b;
```

---

### 4. 関数宣言の前後に空行

```typescript
// ❌
const BASE = 10;
function calculate(x: number): number {
  return x * BASE;
}
const result = calculate(5);

// ✅
const BASE = 10;

function calculate(x: number): number {
  return x * BASE;
}

const result = calculate(5);
```

---

### 5. `export` 文の前に空行

```typescript
// ❌
const DEFAULT_PAGE_SIZE = 20;
export { DEFAULT_PAGE_SIZE };

// ✅
const DEFAULT_PAGE_SIZE = 20;

export { DEFAULT_PAGE_SIZE };
```

---

## React / React Native コンポーネントでのパターン

```typescript
// ✅ フック・変数宣言のグループと JSX return の間に空行
export function MyComponent({ value }: Props) {
  const [count, setCount] = useState(0);
  const doubled = count * 2;

  useEffect(() => {
    console.log(doubled);
  }, [doubled]);

  const handlePress = useCallback(() => {
    setCount((c) => c + 1);
  }, []);

  return (
    <View>
      <Text onPress={handlePress}>{doubled}</Text>
    </View>
  );
}
```

---

## まとめ: チェックリスト

コードを書いた後、以下を確認する:

- [ ] `return` / `throw` の直前に空行があるか（最初のステートメントを除く）
- [ ] `if` / `for` / `while` / `try` の前後に空行があるか（最初のステートメントを除く）
- [ ] 変数宣言グループの後、次が別のステートメント種別なら空行があるか
- [ ] 関数宣言の前後に空行があるか
- [ ] `export` 文の前に空行があるか
