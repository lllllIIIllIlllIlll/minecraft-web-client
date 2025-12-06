// ...
  let lastCall = 0
  bot.on('physicsTick', () => {
    // 既存のスロットリングは mineflayer の physicsTick の速さによっては削除しても良いかもしれないが、
    // 6 FPSのアニメーション更新で十分ならこのままでOK
    if (Date.now() - lastCall < 166) return
    lastCall = Date.now()
    
    // Object.entries() を直接ループするのではなく、キャッシュを検討するか、
    // ここで追跡対象のエンティティIDの配列を取得する

    const trackingData = bot.tracker.trackingData;

    for (const id in trackingData) {
      const { tracking, info } = trackingData[id];
      if (!tracking) continue;
      const e = bot.entities[id];
      if (!e) continue;
      
      // 速度や状態の計算はそのまま
      const speed = info.avgVel;
      // ... (WALKING_SPEED, SPRINTING_SPEED, isCrouched, isWalking, isSprinting の定義はそのまま) ...
      const isCrouched = e === bot.entity ? gameAdditionalState.isSneaking : e['crouching']

      // 三項演算子を入れ子にしてアニメーション名を決定する処理もそのまま

      // アニメーションの切り替えチェック: ここが重要
      const newAnimation = /* ... 複雑な三項演算子 ... */ 'idle'
      
      if (newAnimation !== playerPerAnimation[id]) {
        // ここでの getThreeJsRendererMethods()?.playEntityAnimation() の呼び出しは
        // 3Dレンダラーへのメッセージング/イベント発行を伴うため、これ以上の高速化は難しい。

        // 呼び出しはそのまま
        if (e === bot.entity) {
          getThreeJsRendererMethods()?.playEntityAnimation('player_entity', newAnimation)
        } else {
          getThreeJsRendererMethods()?.playEntityAnimation(e.id, newAnimation)
        }
        playerPerAnimation[id] = newAnimation
      }
    }
  })
// ...
