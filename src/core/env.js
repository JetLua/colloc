import {install} from '@pixi/unsafe-eval'

install(PIXI)

PIXI.settings.PREFER_ENV = PIXI.ENV.WEBGL
PIXI.settings.PRECISION_FRAGMENT = PIXI.PRECISION.HIGH
PIXI.settings.SORTABLE_CHILDREN = true

/* 云开发 环境名 */
PIXI.settings.CLOUD_ENV = 'colloc-dev'

/* PR: https://github.com/pixijs/pixi.js/pull/5695 */
PIXI.interaction.InteractionManager.prototype.onPointerMove = function(originalEvent) {
  if (this.supportsTouchEvents && originalEvent.pointerType === 'touch') return;

  const events = this.normalizeToPointerData(originalEvent);

  if (events[0].pointerType === 'mouse' || events[0].pointerType === 'pen')
  {
      this.didMove = true;

      this.cursor = null;
  }

  const eventLen = events.length;

  for (let i = 0; i < eventLen; i++)
  {
      const event = events[i];

      const interactionData = this.getInteractionDataForPointerId(event);

      const interactionEvent = this.configureInteractionEventForDOMEvent(this.eventData, event, interactionData);

      interactionEvent.data.originalEvent = originalEvent;

      this.processInteractive(interactionEvent, this.renderer._lastObjectRendered, this.processPointerMove, true);

      this.emit('pointermove', interactionEvent);
      if (event.pointerType === 'touch') this.emit('touchmove', interactionEvent);
      if (event.pointerType === 'mouse' || event.pointerType === 'pen') this.emit('mousemove', interactionEvent);
  }

  if (events[0].pointerType === 'mouse')
  {
      this.setCursorMode(this.cursor);

      // TODO BUG for parents interactive object (border order issue)
  }
}