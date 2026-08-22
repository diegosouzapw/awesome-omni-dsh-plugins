# 排名方法論

> 🌐 [English](../../docs/RANKING.md) · **中文（繁體）**

排名是對已合併的公開目錄條目所做的透明檢視。排名絕不使用隱藏的綜合分數,也絕不會把廣義母
專案的星標數當作外掛本身的熱門度。

## 「依星標數排名的熱門外掛」判定條件

只有當以下所有條件皆成立時,條目才符合資格:

```text
kind == plugin(標準的原生 DSH 套件判別值)
repositoryScope == dedicated
verification.status in [eligible, verified]
儲存庫為活躍狀態且未被封存(archived)
星標數屬於該外掛本身的確切儲存庫
條目已合併進公開目錄
```

符合資格的條目會使用 `popularity.starsPolicy: exact-repository`,且 `popularity.stars` 為非負
整數。若出現平手,則以不區分大小寫的外掛 ID 作為決定性的顯示順序;此排序規則不代表任何品質
上的差異。

`kind` 是唯一的作品類型判別欄位。結構描述(schema)刻意不儲存第二個可能與其互相矛盾的 DSH
整合類型欄位。

## 明確排除的項目

隸屬於更廣泛 monorepo 之中的外掛,仍具備收錄目錄的資格,但其母儲存庫的星標數在外掛排名中視
為未定義。此類條目必須使用 `repositoryScope: monorepo`、
`popularity.starsPolicy: undefined-parent-repository` 與 `popularity.stars: null`。它會出現在
功能性分類區塊中,但會被排除在所有以星標數為基礎的排名之外。

外掛家族(plugin families)、主題(themes)、面板美化(skins)、代理技能(skills)、預設設
定檔(presets)、用戶端(clients)、介面(interfaces)、橋接器(bridges)與更廣泛的生態系
專案,不會出現在「依星標數排名的熱門外掛」之中。只要有可比較的資料,它們會獲得各自獨立的區
塊。聚合器(aggregators)、市集(marketplaces)、安裝器目錄與清單類專案不屬於目錄條目,也不
會獲得任何目錄區塊。

## 排名檢視角度

本專案可能發布多種不同的檢視角度,例如星標數、24 小時成長量、7 天成長量、近期更新、已驗證
安裝次數、外掛家族、主題與面板美化、用戶端與介面,以及生態系整合。每一種檢視角度都必須揭露
其自身的收錄規則與快照時間點。

當符合資格的條目數為零時,不會呈現「熱門外掛」區塊。第一個符合資格的合併條目出現時,會建立
「熱門外掛」檢視;直到累積滿十個符合資格的條目後,標籤才會改為「Top 10」。不允許任何佔位或
虛構的排名。

## 驗證不代表背書

`eligible`(合格)代表其公開結構與原生 DSH 整合已通過驗證。`verified`(已驗證)則進一步代
表針對其固定來源或套件,已通過一次安裝的煙霧測試(smoke test)。這兩種狀態皆不代表任何背
書、保證或絕對的安全認證。

<!-- i18n-source-hash: 35a2a2369dd72dd987b84ce335a3a272f2a0776faed705ddfbd85af54629cd6a -->
