import * as pc from 'playcanvas';

export function script() {
  var OrbitCamera = pc.createScript('orbitCamera');
  OrbitCamera.attributes.add('distanceMax', {
    type: 'number',
    default: 0,
    title: 'Distance Max',
    description: 'Setting this at 0 will give an infinite distance limit',
  }),
    OrbitCamera.attributes.add('distanceMin', {
      type: 'number',
      default: 0,
      title: 'Distance Min',
    }),
    OrbitCamera.attributes.add('pitchAngleMax', {
      type: 'number',
      default: 90,
      title: 'Pitch Angle Max (degrees)',
    }),
    OrbitCamera.attributes.add('pitchAngleMin', {
      type: 'number',
      default: -90,
      title: 'Pitch Angle Min (degrees)',
    }),
    OrbitCamera.attributes.add('inertiaFactor', {
      type: 'number',
      default: 0,
      title: 'Inertia Factor',
      description:
        'Higher value means that the camera will continue moving after the user has stopped dragging. 0 is fully responsive.',
    }),
    OrbitCamera.attributes.add('focusEntity', {
      type: 'entity',
      title: 'Focus Entity',
      description:
        'Entity for the camera to focus on. If blank, then the camera will use the whole scene',
    }),
    OrbitCamera.attributes.add('frameOnStart', {
      type: 'boolean',
      default: !0,
      title: 'Frame on Start',
      description: 'Frames the entity or scene at the start of the application."',
    }),
    Object.defineProperty(OrbitCamera.prototype, 'distance', {
      get: function () {
        return this._targetDistance;
      },
      set: function (t) {
        this._targetDistance = this._clampDistance(t);
      },
    }),
    Object.defineProperty(OrbitCamera.prototype, 'pitch', {
      get: function () {
        return this._targetPitch;
      },
      set: function (t) {
        this._targetPitch = this._clampPitchAngle(t);
      },
    }),
    Object.defineProperty(OrbitCamera.prototype, 'yaw', {
      get: function () {
        return this._targetYaw;
      },
      set: function (t) {
        this._targetYaw = t;
        var i = (this._targetYaw - this._yaw) % 360;
        this._targetYaw =
          i > 180 ? this._yaw - (360 - i) : i < -180 ? this._yaw + (360 + i) : this._yaw + i;
      },
    }),
    Object.defineProperty(OrbitCamera.prototype, 'pivotPoint', {
      get: function () {
        return this._pivotPoint;
      },
      set: function (t) {
        this._pivotPoint.copy(t);
      },
    }),
    (OrbitCamera.prototype.focus = function (t) {
      this._buildAabb(t, 0);
      var i = this._modelsAabb.halfExtents,
        e = Math.max(i.x, Math.max(i.y, i.z));
      (e /= Math.tan(0.5 * this.entity.camera.fov * pc.math.DEG_TO_RAD)),
        (e *= 2),
        (this.distance = e),
        this._removeInertia(),
        this._pivotPoint.copy(this._modelsAabb.center);
    }),
    (OrbitCamera.distanceBetween = new pc.Vec3()),
    (OrbitCamera.prototype.resetAndLookAtPoint = function (t, i) {
      this.pivotPoint.copy(i), this.entity.setPosition(t), this.entity.lookAt(i);
      var e = OrbitCamera.distanceBetween;
      e.sub2(i, t), (this.distance = e.length()), this.pivotPoint.copy(i);
      var a = this.entity.getRotation();
      (this.yaw = this._calcYaw(a)),
        (this.pitch = this._calcPitch(a, this.yaw)),
        this._removeInertia(),
        this._updatePosition();
    }),
    (OrbitCamera.prototype.resetAndLookAtEntity = function (t, i) {
      this._buildAabb(i, 0), this.resetAndLookAtPoint(t, this._modelsAabb.center);
    }),
    (OrbitCamera.prototype.reset = function (t, i, e) {
      (this.pitch = i), (this.yaw = t), (this.distance = e), this._removeInertia();
    }),
    (OrbitCamera.prototype.initialize = function () {
      var t = this,
        onWindowResize = function () {
          t._checkAspectRatio();
        };
      window.addEventListener('resize', onWindowResize, !1),
        this._checkAspectRatio(),
        (this._modelsAabb = new pc.BoundingBox()),
        this._buildAabb(this.focusEntity || this.app.root, 0),
        this.entity.lookAt(this._modelsAabb.center),
        (this._pivotPoint = new pc.Vec3()),
        this._pivotPoint.copy(this._modelsAabb.center);
      var i = this.entity.getRotation();
      if (
        ((this._yaw = this._calcYaw(i)),
        (this._pitch = this._clampPitchAngle(this._calcPitch(i, this._yaw))),
        this.entity.setLocalEulerAngles(this._pitch, this._yaw, 0),
        (this._distance = 0),
        (this._targetYaw = this._yaw),
        (this._targetPitch = this._pitch),
        this.frameOnStart)
      )
        this.focus(this.focusEntity || this.app.root);
      else {
        var e = new pc.Vec3();
        e.sub2(this.entity.getPosition(), this._pivotPoint),
          (this._distance = this._clampDistance(e.length()));
      }
      (this._targetDistance = this._distance),
        this.on('attr:distanceMin', function (t, i) {
          this._targetDistance = this._clampDistance(this._distance);
        }),
        this.on('attr:distanceMax', function (t, i) {
          this._targetDistance = this._clampDistance(this._distance);
        }),
        this.on('attr:pitchAngleMin', function (t, i) {
          this._targetPitch = this._clampPitchAngle(this._pitch);
        }),
        this.on('attr:pitchAngleMax', function (t, i) {
          this._targetPitch = this._clampPitchAngle(this._pitch);
        }),
        this.on('attr:focusEntity', function (t, i) {
          this.frameOnStart
            ? this.focus(t || this.app.root)
            : this.resetAndLookAtEntity(this.entity.getPosition(), t || this.app.root);
        }),
        this.on('attr:frameOnStart', function (t, i) {
          t && this.focus(this.focusEntity || this.app.root);
        }),
        this.on('destroy', function () {
          window.removeEventListener('resize', onWindowResize, !1);
        });
    }),
    (OrbitCamera.prototype.update = function (t) {
      var i = 0 === this.inertiaFactor ? 1 : Math.min(t / this.inertiaFactor, 1);
      (this._distance = pc.math.lerp(this._distance, this._targetDistance, i)),
        (this._yaw = pc.math.lerp(this._yaw, this._targetYaw, i)),
        (this._pitch = pc.math.lerp(this._pitch, this._targetPitch, i)),
        this._updatePosition();
    }),
    (OrbitCamera.prototype._updatePosition = function () {
      this.entity.setLocalPosition(0, 0, 0),
        this.entity.setLocalEulerAngles(this._pitch, this._yaw, 0);
      var t = this.entity.getPosition();
      t.copy(this.entity.forward),
        t.scale(-this._distance),
        t.add(this.pivotPoint),
        this.entity.setPosition(t);
    }),
    (OrbitCamera.prototype._removeInertia = function () {
      (this._yaw = this._targetYaw),
        (this._pitch = this._targetPitch),
        (this._distance = this._targetDistance);
    }),
    (OrbitCamera.prototype._checkAspectRatio = function () {
      var t = this.app.graphicsDevice.height,
        i = this.app.graphicsDevice.width;
      this.entity.camera.horizontalFov = t > i;
    }),
    (OrbitCamera.prototype._buildAabb = function (t, i) {
      var e = 0,
        a = 0,
        n = null,
        s = [],
        r = t.findComponents('render');
      for (e = 0; e < r.length; ++e)
        for (n = r[e].meshInstances, a = 0; a < n.length; a++) s.push(n[a]);
      var h = t.findComponents('model');
      for (e = 0; e < h.length; ++e)
        for (n = h[e].meshInstances, a = 0; a < n.length; a++) s.push(n[a]);
      for (e = 0; e < s.length; e++)
        0 === i ? this._modelsAabb.copy(s[e].aabb) : this._modelsAabb.add(s[e].aabb), (i += 1);
      return i;
    }),
    (OrbitCamera.prototype._calcYaw = function (t) {
      var i = new pc.Vec3();
      return t.transformVector(pc.Vec3.FORWARD, i), Math.atan2(-i.x, -i.z) * pc.math.RAD_TO_DEG;
    }),
    (OrbitCamera.prototype._clampDistance = function (t) {
      return this.distanceMax > 0
        ? pc.math.clamp(t, this.distanceMin, this.distanceMax)
        : Math.max(t, this.distanceMin);
    }),
    (OrbitCamera.prototype._clampPitchAngle = function (t) {
      return pc.math.clamp(t, -this.pitchAngleMax, -this.pitchAngleMin);
    }),
    (OrbitCamera.quatWithoutYaw = new pc.Quat()),
    (OrbitCamera.yawOffset = new pc.Quat()),
    (OrbitCamera.prototype._calcPitch = function (t, i) {
      var e = OrbitCamera.quatWithoutYaw,
        a = OrbitCamera.yawOffset;
      a.setFromEulerAngles(0, -i, 0), e.mul2(a, t);
      var n = new pc.Vec3();
      return e.transformVector(pc.Vec3.FORWARD, n), Math.atan2(n.y, -n.z) * pc.math.RAD_TO_DEG;
    });
  var MouseInput = pc.createScript('mouseInput');
  MouseInput.attributes.add('orbitSensitivity', {
    type: 'number',
    default: 0.3,
    title: 'Orbit Sensitivity',
    description: 'How fast the camera moves around the orbit. Higher is faster',
  }),
    MouseInput.attributes.add('distanceSensitivity', {
      type: 'number',
      default: 0.15,
      title: 'Distance Sensitivity',
      description: 'How fast the camera moves in and out. Higher is faster',
    }),
    (MouseInput.prototype.initialize = function () {
      if (((this.orbitCamera = this.entity.script.orbitCamera), this.orbitCamera)) {
        var t = this,
          onMouseOut = function (o) {
            t.onMouseOut(o);
          };
        this.app.mouse.on(pc.EVENT_MOUSEDOWN, this.onMouseDown, this),
          this.app.mouse.on(pc.EVENT_MOUSEUP, this.onMouseUp, this),
          this.app.mouse.on(pc.EVENT_MOUSEMOVE, this.onMouseMove, this),
          this.app.mouse.on(pc.EVENT_MOUSEWHEEL, this.onMouseWheel, this),
          window.addEventListener('mouseout', onMouseOut, !1),
          this.on('destroy', function () {
            this.app.mouse.off(pc.EVENT_MOUSEDOWN, this.onMouseDown, this),
              this.app.mouse.off(pc.EVENT_MOUSEUP, this.onMouseUp, this),
              this.app.mouse.off(pc.EVENT_MOUSEMOVE, this.onMouseMove, this),
              this.app.mouse.off(pc.EVENT_MOUSEWHEEL, this.onMouseWheel, this),
              window.removeEventListener('mouseout', onMouseOut, !1);
          });
      }
      this.app.mouse.disableContextMenu(),
        (this.lookButtonDown = !1),
        (this.panButtonDown = !1),
        (this.lastPoint = new pc.Vec2());
    }),
    (MouseInput.fromWorldPoint = new pc.Vec3()),
    (MouseInput.toWorldPoint = new pc.Vec3()),
    (MouseInput.worldDiff = new pc.Vec3()),
    (MouseInput.prototype.pan = function (t) {
      var o = MouseInput.fromWorldPoint,
        e = MouseInput.toWorldPoint,
        i = MouseInput.worldDiff,
        s = this.entity.camera,
        n = this.orbitCamera.distance;
      s.screenToWorld(t.x, t.y, n, o),
        s.screenToWorld(this.lastPoint.x, this.lastPoint.y, n, e),
        i.sub2(e, o),
        this.orbitCamera.pivotPoint.add(i);
    }),
    (MouseInput.prototype.onMouseDown = function (t) {
      switch (t.button) {
        case pc.MOUSEBUTTON_LEFT:
          this.lookButtonDown = !0;
          break;
        case pc.MOUSEBUTTON_MIDDLE:
        case pc.MOUSEBUTTON_RIGHT:
          this.panButtonDown = !0;
      }
    }),
    (MouseInput.prototype.onMouseUp = function (t) {
      switch (t.button) {
        case pc.MOUSEBUTTON_LEFT:
          this.lookButtonDown = !1;
          break;
        case pc.MOUSEBUTTON_MIDDLE:
        case pc.MOUSEBUTTON_RIGHT:
          this.panButtonDown = !1;
      }
    }),
    (MouseInput.prototype.onMouseMove = function (t) {
      pc.app.mouse;
      this.lookButtonDown
        ? ((this.orbitCamera.pitch -= t.dy * this.orbitSensitivity),
          (this.orbitCamera.yaw -= t.dx * this.orbitSensitivity))
        : this.panButtonDown && this.pan(t),
        this.lastPoint.set(t.x, t.y);
    }),
    (MouseInput.prototype.onMouseWheel = function (t) {
      (this.orbitCamera.distance -=
        t.wheel * this.distanceSensitivity * (0.1 * this.orbitCamera.distance)),
        t.event.preventDefault();
    }),
    (MouseInput.prototype.onMouseOut = function (t) {
      (this.lookButtonDown = !1), (this.panButtonDown = !1);
    });
  var KeyboardInput = pc.createScript('keyboardInput');
  (KeyboardInput.prototype.initialize = function () {
    this.orbitCamera = this.entity.script.orbitCamera;
  }),
    (KeyboardInput.prototype.postInitialize = function () {
      this.orbitCamera &&
        ((this.startDistance = this.orbitCamera.distance),
        (this.startYaw = this.orbitCamera.yaw),
        (this.startPitch = this.orbitCamera.pitch),
        (this.startPivotPosition = this.orbitCamera.pivotPoint.clone()));
    }),
    (KeyboardInput.prototype.update = function (t) {
      this.orbitCamera &&
        this.app.keyboard.wasPressed(pc.KEY_SPACE) &&
        (this.orbitCamera.reset(this.startYaw, this.startPitch, this.startDistance),
        (this.orbitCamera.pivotPoint = this.startPivotPosition));
    });
  var TouchInput = pc.createScript('touchInput');
  TouchInput.attributes.add('orbitSensitivity', {
    type: 'number',
    default: 0.4,
    title: 'Orbit Sensitivity',
    description: 'How fast the camera moves around the orbit. Higher is faster',
  }),
    TouchInput.attributes.add('distanceSensitivity', {
      type: 'number',
      default: 0.2,
      title: 'Distance Sensitivity',
      description: 'How fast the camera moves in and out. Higher is faster',
    }),
    (TouchInput.prototype.initialize = function () {
      (this.orbitCamera = this.entity.script.orbitCamera),
        (this.lastTouchPoint = new pc.Vec2()),
        (this.lastPinchMidPoint = new pc.Vec2()),
        (this.lastPinchDistance = 0),
        this.orbitCamera &&
          this.app.touch &&
          (this.app.touch.on(pc.EVENT_TOUCHSTART, this.onTouchStartEndCancel, this),
          this.app.touch.on(pc.EVENT_TOUCHEND, this.onTouchStartEndCancel, this),
          this.app.touch.on(pc.EVENT_TOUCHCANCEL, this.onTouchStartEndCancel, this),
          this.app.touch.on(pc.EVENT_TOUCHMOVE, this.onTouchMove, this),
          this.on('destroy', function () {
            this.app.touch.off(pc.EVENT_TOUCHSTART, this.onTouchStartEndCancel, this),
              this.app.touch.off(pc.EVENT_TOUCHEND, this.onTouchStartEndCancel, this),
              this.app.touch.off(pc.EVENT_TOUCHCANCEL, this.onTouchStartEndCancel, this),
              this.app.touch.off(pc.EVENT_TOUCHMOVE, this.onTouchMove, this);
          }));
    }),
    (TouchInput.prototype.getPinchDistance = function (t, i) {
      var o = t.x - i.x,
        n = t.y - i.y;
      return Math.sqrt(o * o + n * n);
    }),
    (TouchInput.prototype.calcMidPoint = function (t, i, o) {
      o.set(i.x - t.x, i.y - t.y), o.scale(0.5), (o.x += t.x), (o.y += t.y);
    }),
    (TouchInput.prototype.onTouchStartEndCancel = function (t) {
      var i = t.touches;
      1 == i.length
        ? this.lastTouchPoint.set(i[0].x, i[0].y)
        : 2 == i.length &&
          ((this.lastPinchDistance = this.getPinchDistance(i[0], i[1])),
          this.calcMidPoint(i[0], i[1], this.lastPinchMidPoint));
    }),
    (TouchInput.fromWorldPoint = new pc.Vec3()),
    (TouchInput.toWorldPoint = new pc.Vec3()),
    (TouchInput.worldDiff = new pc.Vec3()),
    (TouchInput.prototype.pan = function (t) {
      var i = TouchInput.fromWorldPoint,
        o = TouchInput.toWorldPoint,
        n = TouchInput.worldDiff,
        h = this.entity.camera,
        c = this.orbitCamera.distance;
      h.screenToWorld(t.x, t.y, c, i),
        h.screenToWorld(this.lastPinchMidPoint.x, this.lastPinchMidPoint.y, c, o),
        n.sub2(o, i),
        this.orbitCamera.pivotPoint.add(n);
    }),
    (TouchInput.pinchMidPoint = new pc.Vec2()),
    (TouchInput.prototype.onTouchMove = function (t) {
      var i = TouchInput.pinchMidPoint,
        o = t.touches;
      if (1 == o.length) {
        var n = o[0];
        (this.orbitCamera.pitch -= (n.y - this.lastTouchPoint.y) * this.orbitSensitivity),
          (this.orbitCamera.yaw -= (n.x - this.lastTouchPoint.x) * this.orbitSensitivity),
          this.lastTouchPoint.set(n.x, n.y);
      } else if (2 == o.length) {
        var h = this.getPinchDistance(o[0], o[1]),
          c = h - this.lastPinchDistance;
        (this.lastPinchDistance = h),
          (this.orbitCamera.distance -=
            c * this.distanceSensitivity * 0.1 * (0.1 * this.orbitCamera.distance)),
          this.calcMidPoint(o[0], o[1], i),
          this.pan(i),
          this.lastPinchMidPoint.copy(i);
      }
    });
  var LoadGlbUrl = pc.createScript('loadGlbUrl');
  LoadGlbUrl.attributes.add('glbIPFSAsset', { type: 'string' }),
    (LoadGlbUrl.prototype.initialize = function () {
      var t = this;
      window.utils.loadGlbContainerFromUrl(this.glbIPFSAsset, null, 'ModelGLB', function (i, a) {
        console.log(a), console.log(a.resource.animations);
        var e = a.resource.instantiateRenderEntity();
        t.entity.addChild(e),
          e.addComponent('anim', { activate: !0 }),
          e.anim.assignAnimation('idle', a.resource.animations[0].resource),
          e.anim.baseLayer.transition('idle');
      });
    }),
    (LoadGlbUrl.prototype.update = function (t) {});
  !(function () {
    var n = {},
      e = pc.Application.getApplication();
    (n.loadGlbContainerFromAsset = function (n, e, t, o) {
      var r = new Blob([n.resource]),
        a = URL.createObjectURL(r);
      return this.loadGlbContainerFromUrl(a, e, t, function (n, e) {
        o(n, e), URL.revokeObjectURL(a);
      });
    }),
      (n.loadGlbContainerFromUrl = function (n, t, o, r) {
        var a = o + '.glb',
          l = { url: n, filename: a },
          i = new pc.Asset(a, 'container', l, null, t);
        return (
          i.once('load', function (n) {
            if (r) {
              var e = n.resource.animations;
              if (1 == e.length) e[0].name = o;
              else if (e.length > 1)
                for (var t = 0; t < e.length; ++t) e[t].name = o + ' ' + t.toString();
              r(null, n);
            }
          }),
          e.assets.add(i),
          e.assets.load(i),
          i
        );
      }),
      (window.utils = n);
  })();
}
