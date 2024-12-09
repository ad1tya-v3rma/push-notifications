"use strict";
(self.webpackChunkui = self.webpackChunkui || []).push([[792], {
    837: () => {
        function Q(e) {
            return "function" == typeof e
        }

        function ro(e) {
            const n = e(r => {
                Error.call(r), r.stack = (new Error).stack
            });
            return n.prototype = Object.create(Error.prototype), n.prototype.constructor = n, n
        }

        const Mi = ro(e => function (n) {
            e(this), this.message = n ? `${n.length} errors occurred during unsubscription:\n${n.map((r, o) => `${o + 1}) ${r.toString()}`).join("\n  ")}` : "", this.name = "UnsubscriptionError", this.errors = n
        });

        function oo(e, t) {
            if (e) {
                const n = e.indexOf(t);
                0 <= n && e.splice(n, 1)
            }
        }

        class Ge {
            constructor(t) {
                this.initialTeardown = t, this.closed = !1, this._parentage = null, this._finalizers = null
            }

            unsubscribe() {
                let t;
                if (!this.closed) {
                    this.closed = !0;
                    const {_parentage: n} = this;
                    if (n) if (this._parentage = null, Array.isArray(n)) for (const i of n) i.remove(this); else n.remove(this);
                    const {initialTeardown: r} = this;
                    if (Q(r)) try {
                        r()
                    } catch (i) {
                        t = i instanceof Mi ? i.errors : [i]
                    }
                    const {_finalizers: o} = this;
                    if (o) {
                        this._finalizers = null;
                        for (const i of o) try {
                            ff(i)
                        } catch (s) {
                            t = t ?? [], s instanceof Mi ? t = [...t, ...s.errors] : t.push(s)
                        }
                    }
                    if (t) throw new Mi(t)
                }
            }

            add(t) {
                var n;
                if (t && t !== this) if (this.closed) ff(t); else {
                    if (t instanceof Ge) {
                        if (t.closed || t._hasParent(this)) return;
                        t._addParent(this)
                    }
                    (this._finalizers = null !== (n = this._finalizers) && void 0 !== n ? n : []).push(t)
                }
            }

            _hasParent(t) {
                const {_parentage: n} = this;
                return n === t || Array.isArray(n) && n.includes(t)
            }

            _addParent(t) {
                const {_parentage: n} = this;
                this._parentage = Array.isArray(n) ? (n.push(t), n) : n ? [n, t] : t
            }

            _removeParent(t) {
                const {_parentage: n} = this;
                n === t ? this._parentage = null : Array.isArray(n) && oo(n, t)
            }

            remove(t) {
                const {_finalizers: n} = this;
                n && oo(n, t), t instanceof Ge && t._removeParent(this)
            }
        }

        Ge.EMPTY = (() => {
            const e = new Ge;
            return e.closed = !0, e
        })();
        const lf = Ge.EMPTY;

        function df(e) {
            return e instanceof Ge || e && "closed" in e && Q(e.remove) && Q(e.add) && Q(e.unsubscribe)
        }

        function ff(e) {
            Q(e) ? e() : e.unsubscribe()
        }

        const En = {
            onUnhandledError: null,
            onStoppedNotification: null,
            Promise: void 0,
            useDeprecatedSynchronousErrorHandling: !1,
            useDeprecatedNextContext: !1
        }, Ti = {
            setTimeout(e, t, ...n) {
                const {delegate: r} = Ti;
                return r?.setTimeout ? r.setTimeout(e, t, ...n) : setTimeout(e, t, ...n)
            }, clearTimeout(e) {
                const {delegate: t} = Ti;
                return (t?.clearTimeout || clearTimeout)(e)
            }, delegate: void 0
        };

        function hf(e) {
            Ti.setTimeout(() => {
                const {onUnhandledError: t} = En;
                if (!t) throw e;
                t(e)
            })
        }

        function Wa() {
        }

        const YC = Za("C", void 0, void 0);

        function Za(e, t, n) {
            return {kind: e, value: t, error: n}
        }

        let In = null;

        function Ai(e) {
            if (En.useDeprecatedSynchronousErrorHandling) {
                const t = !In;
                if (t && (In = {errorThrown: !1, error: null}), e(), t) {
                    const {errorThrown: n, error: r} = In;
                    if (In = null, n) throw r
                }
            } else e()
        }

        class Ya extends Ge {
            constructor(t) {
                super(), this.isStopped = !1, t ? (this.destination = t, df(t) && t.add(this)) : this.destination = nE
            }

            static create(t, n, r) {
                return new io(t, n, r)
            }

            next(t) {
                this.isStopped ? Xa(function XC(e) {
                    return Za("N", e, void 0)
                }(t), this) : this._next(t)
            }

            error(t) {
                this.isStopped ? Xa(function QC(e) {
                    return Za("E", void 0, e)
                }(t), this) : (this.isStopped = !0, this._error(t))
            }

            complete() {
                this.isStopped ? Xa(YC, this) : (this.isStopped = !0, this._complete())
            }

            unsubscribe() {
                this.closed || (this.isStopped = !0, super.unsubscribe(), this.destination = null)
            }

            _next(t) {
                this.destination.next(t)
            }

            _error(t) {
                try {
                    this.destination.error(t)
                } finally {
                    this.unsubscribe()
                }
            }

            _complete() {
                try {
                    this.destination.complete()
                } finally {
                    this.unsubscribe()
                }
            }
        }

        const KC = Function.prototype.bind;

        function Qa(e, t) {
            return KC.call(e, t)
        }

        class eE {
            constructor(t) {
                this.partialObserver = t
            }

            next(t) {
                const {partialObserver: n} = this;
                if (n.next) try {
                    n.next(t)
                } catch (r) {
                    Ni(r)
                }
            }

            error(t) {
                const {partialObserver: n} = this;
                if (n.error) try {
                    n.error(t)
                } catch (r) {
                    Ni(r)
                } else Ni(t)
            }

            complete() {
                const {partialObserver: t} = this;
                if (t.complete) try {
                    t.complete()
                } catch (n) {
                    Ni(n)
                }
            }
        }

        class io extends Ya {
            constructor(t, n, r) {
                let o;
                if (super(), Q(t) || !t) o = {next: t ?? void 0, error: n ?? void 0, complete: r ?? void 0}; else {
                    let i;
                    this && En.useDeprecatedNextContext ? (i = Object.create(t), i.unsubscribe = () => this.unsubscribe(), o = {
                        next: t.next && Qa(t.next, i),
                        error: t.error && Qa(t.error, i),
                        complete: t.complete && Qa(t.complete, i)
                    }) : o = t
                }
                this.destination = new eE(o)
            }
        }

        function Ni(e) {
            En.useDeprecatedSynchronousErrorHandling ? function JC(e) {
                En.useDeprecatedSynchronousErrorHandling && In && (In.errorThrown = !0, In.error = e)
            }(e) : hf(e)
        }

        function Xa(e, t) {
            const {onStoppedNotification: n} = En;
            n && Ti.setTimeout(() => n(e, t))
        }

        const nE = {
            closed: !0, next: Wa, error: function tE(e) {
                throw e
            }, complete: Wa
        }, Ja = "function" == typeof Symbol && Symbol.observable || "@@observable";

        function nn(e) {
            return e
        }

        function pf(e) {
            return 0 === e.length ? nn : 1 === e.length ? e[0] : function (n) {
                return e.reduce((r, o) => o(r), n)
            }
        }

        let le = (() => {
            class e {
                constructor(n) {
                    n && (this._subscribe = n)
                }

                lift(n) {
                    const r = new e;
                    return r.source = this, r.operator = n, r
                }

                subscribe(n, r, o) {
                    const i = function iE(e) {
                        return e && e instanceof Ya || function oE(e) {
                            return e && Q(e.next) && Q(e.error) && Q(e.complete)
                        }(e) && df(e)
                    }(n) ? n : new io(n, r, o);
                    return Ai(() => {
                        const {operator: s, source: a} = this;
                        i.add(s ? s.call(i, a) : a ? this._subscribe(i) : this._trySubscribe(i))
                    }), i
                }

                _trySubscribe(n) {
                    try {
                        return this._subscribe(n)
                    } catch (r) {
                        n.error(r)
                    }
                }

                forEach(n, r) {
                    return new (r = gf(r))((o, i) => {
                        const s = new io({
                            next: a => {
                                try {
                                    n(a)
                                } catch (u) {
                                    i(u), s.unsubscribe()
                                }
                            }, error: i, complete: o
                        });
                        this.subscribe(s)
                    })
                }

                _subscribe(n) {
                    var r;
                    return null === (r = this.source) || void 0 === r ? void 0 : r.subscribe(n)
                }

                [Ja]() {
                    return this
                }

                pipe(...n) {
                    return pf(n)(this)
                }

                toPromise(n) {
                    return new (n = gf(n))((r, o) => {
                        let i;
                        this.subscribe(s => i = s, s => o(s), () => r(i))
                    })
                }
            }

            return e.create = t => new e(t), e
        })();

        function gf(e) {
            var t;
            return null !== (t = e ?? En.Promise) && void 0 !== t ? t : Promise
        }

        const sE = ro(e => function () {
            e(this), this.name = "ObjectUnsubscribedError", this.message = "object unsubscribed"
        });
        let lt = (() => {
            class e extends le {
                constructor() {
                    super(), this.closed = !1, this.currentObservers = null, this.observers = [], this.isStopped = !1, this.hasError = !1, this.thrownError = null
                }

                lift(n) {
                    const r = new mf(this, this);
                    return r.operator = n, r
                }

                _throwIfClosed() {
                    if (this.closed) throw new sE
                }

                next(n) {
                    Ai(() => {
                        if (this._throwIfClosed(), !this.isStopped) {
                            this.currentObservers || (this.currentObservers = Array.from(this.observers));
                            for (const r of this.currentObservers) r.next(n)
                        }
                    })
                }

                error(n) {
                    Ai(() => {
                        if (this._throwIfClosed(), !this.isStopped) {
                            this.hasError = this.isStopped = !0, this.thrownError = n;
                            const {observers: r} = this;
                            for (; r.length;) r.shift().error(n)
                        }
                    })
                }

                complete() {
                    Ai(() => {
                        if (this._throwIfClosed(), !this.isStopped) {
                            this.isStopped = !0;
                            const {observers: n} = this;
                            for (; n.length;) n.shift().complete()
                        }
                    })
                }

                unsubscribe() {
                    this.isStopped = this.closed = !0, this.observers = this.currentObservers = null
                }

                get observed() {
                    var n;
                    return (null === (n = this.observers) || void 0 === n ? void 0 : n.length) > 0
                }

                _trySubscribe(n) {
                    return this._throwIfClosed(), super._trySubscribe(n)
                }

                _subscribe(n) {
                    return this._throwIfClosed(), this._checkFinalizedStatuses(n), this._innerSubscribe(n)
                }

                _innerSubscribe(n) {
                    const {hasError: r, isStopped: o, observers: i} = this;
                    return r || o ? lf : (this.currentObservers = null, i.push(n), new Ge(() => {
                        this.currentObservers = null, oo(i, n)
                    }))
                }

                _checkFinalizedStatuses(n) {
                    const {hasError: r, thrownError: o, isStopped: i} = this;
                    r ? n.error(o) : i && n.complete()
                }

                asObservable() {
                    const n = new le;
                    return n.source = this, n
                }
            }

            return e.create = (t, n) => new mf(t, n), e
        })();

        class mf extends lt {
            constructor(t, n) {
                super(), this.destination = t, this.source = n
            }

            next(t) {
                var n, r;
                null === (r = null === (n = this.destination) || void 0 === n ? void 0 : n.next) || void 0 === r || r.call(n, t)
            }

            error(t) {
                var n, r;
                null === (r = null === (n = this.destination) || void 0 === n ? void 0 : n.error) || void 0 === r || r.call(n, t)
            }

            complete() {
                var t, n;
                null === (n = null === (t = this.destination) || void 0 === t ? void 0 : t.complete) || void 0 === n || n.call(t)
            }

            _subscribe(t) {
                var n, r;
                return null !== (r = null === (n = this.source) || void 0 === n ? void 0 : n.subscribe(t)) && void 0 !== r ? r : lf
            }
        }

        function vf(e) {
            return Q(e?.lift)
        }

        function fe(e) {
            return t => {
                if (vf(t)) return t.lift(function (n) {
                    try {
                        return e(n, this)
                    } catch (r) {
                        this.error(r)
                    }
                });
                throw new TypeError("Unable to lift unknown Observable type")
            }
        }

        function he(e, t, n, r, o) {
            return new aE(e, t, n, r, o)
        }

        class aE extends Ya {
            constructor(t, n, r, o, i, s) {
                super(t), this.onFinalize = i, this.shouldUnsubscribe = s, this._next = n ? function (a) {
                    try {
                        n(a)
                    } catch (u) {
                        t.error(u)
                    }
                } : super._next, this._error = o ? function (a) {
                    try {
                        o(a)
                    } catch (u) {
                        t.error(u)
                    } finally {
                        this.unsubscribe()
                    }
                } : super._error, this._complete = r ? function () {
                    try {
                        r()
                    } catch (a) {
                        t.error(a)
                    } finally {
                        this.unsubscribe()
                    }
                } : super._complete
            }

            unsubscribe() {
                var t;
                if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
                    const {closed: n} = this;
                    super.unsubscribe(), !n && (null === (t = this.onFinalize) || void 0 === t || t.call(this))
                }
            }
        }

        function q(e, t) {
            return fe((n, r) => {
                let o = 0;
                n.subscribe(he(r, i => {
                    r.next(e.call(t, i, o++))
                }))
            })
        }

        function rn(e) {
            return this instanceof rn ? (this.v = e, this) : new rn(e)
        }

        function Cf(e) {
            if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
            var n, t = e[Symbol.asyncIterator];
            return t ? t.call(e) : (e = function nu(e) {
                var t = "function" == typeof Symbol && Symbol.iterator, n = t && e[t], r = 0;
                if (n) return n.call(e);
                if (e && "number" == typeof e.length) return {
                    next: function () {
                        return e && r >= e.length && (e = void 0), {value: e && e[r++], done: !e}
                    }
                };
                throw new TypeError(t ? "Object is not iterable." : "Symbol.iterator is not defined.")
            }(e), n = {}, r("next"), r("throw"), r("return"), n[Symbol.asyncIterator] = function () {
                return this
            }, n);

            function r(i) {
                n[i] = e[i] && function (s) {
                    return new Promise(function (a, u) {
                        !function o(i, s, a, u) {
                            Promise.resolve(u).then(function (c) {
                                i({value: c, done: a})
                            }, s)
                        }(a, u, (s = e[i](s)).done, s.value)
                    })
                }
            }
        }

        "function" == typeof SuppressedError && SuppressedError;
        const Ef = e => e && "number" == typeof e.length && "function" != typeof e;

        function If(e) {
            return Q(e?.then)
        }

        function bf(e) {
            return Q(e[Ja])
        }

        function _f(e) {
            return Symbol.asyncIterator && Q(e?.[Symbol.asyncIterator])
        }

        function Sf(e) {
            return new TypeError(`You provided ${null !== e && "object" == typeof e ? "an invalid object" : `'${e}'`} where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`)
        }

        const Mf = function PE() {
            return "function" == typeof Symbol && Symbol.iterator ? Symbol.iterator : "@@iterator"
        }();

        function Tf(e) {
            return Q(e?.[Mf])
        }

        function Af(e) {
            return function wf(e, t, n) {
                if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
                var o, r = n.apply(e, t || []), i = [];
                return o = Object.create(("function" == typeof AsyncIterator ? AsyncIterator : Object).prototype), a("next"), a("throw"), a("return", function s(h) {
                    return function (p) {
                        return Promise.resolve(p).then(h, d)
                    }
                }), o[Symbol.asyncIterator] = function () {
                    return this
                }, o;

                function a(h, p) {
                    r[h] && (o[h] = function (g) {
                        return new Promise(function (v, D) {
                            i.push([h, g, v, D]) > 1 || u(h, g)
                        })
                    }, p && (o[h] = p(o[h])))
                }

                function u(h, p) {
                    try {
                        !function c(h) {
                            h.value instanceof rn ? Promise.resolve(h.value.v).then(l, d) : f(i[0][2], h)
                        }(r[h](p))
                    } catch (g) {
                        f(i[0][3], g)
                    }
                }

                function l(h) {
                    u("next", h)
                }

                function d(h) {
                    u("throw", h)
                }

                function f(h, p) {
                    h(p), i.shift(), i.length && u(i[0][0], i[0][1])
                }
            }(this, arguments, function* () {
                const n = e.getReader();
                try {
                    for (; ;) {
                        const {value: r, done: o} = yield rn(n.read());
                        if (o) return yield rn(void 0);
                        yield yield rn(r)
                    }
                } finally {
                    n.releaseLock()
                }
            })
        }

        function Nf(e) {
            return Q(e?.getReader)
        }

        function et(e) {
            if (e instanceof le) return e;
            if (null != e) {
                if (bf(e)) return function FE(e) {
                    return new le(t => {
                        const n = e[Ja]();
                        if (Q(n.subscribe)) return n.subscribe(t);
                        throw new TypeError("Provided object does not correctly implement Symbol.observable")
                    })
                }(e);
                if (Ef(e)) return function kE(e) {
                    return new le(t => {
                        for (let n = 0; n < e.length && !t.closed; n++) t.next(e[n]);
                        t.complete()
                    })
                }(e);
                if (If(e)) return function LE(e) {
                    return new le(t => {
                        e.then(n => {
                            t.closed || (t.next(n), t.complete())
                        }, n => t.error(n)).then(null, hf)
                    })
                }(e);
                if (_f(e)) return Rf(e);
                if (Tf(e)) return function jE(e) {
                    return new le(t => {
                        for (const n of e) if (t.next(n), t.closed) return;
                        t.complete()
                    })
                }(e);
                if (Nf(e)) return function $E(e) {
                    return Rf(Af(e))
                }(e)
            }
            throw Sf(e)
        }

        function Rf(e) {
            return new le(t => {
                (function HE(e, t) {
                    var n, r, o, i;
                    return function yf(e, t, n, r) {
                        return new (n || (n = Promise))(function (i, s) {
                            function a(l) {
                                try {
                                    c(r.next(l))
                                } catch (d) {
                                    s(d)
                                }
                            }

                            function u(l) {
                                try {
                                    c(r.throw(l))
                                } catch (d) {
                                    s(d)
                                }
                            }

                            function c(l) {
                                l.done ? i(l.value) : function o(i) {
                                    return i instanceof n ? i : new n(function (s) {
                                        s(i)
                                    })
                                }(l.value).then(a, u)
                            }

                            c((r = r.apply(e, t || [])).next())
                        })
                    }(this, void 0, void 0, function* () {
                        try {
                            for (n = Cf(e); !(r = yield n.next()).done;) if (t.next(r.value), t.closed) return
                        } catch (s) {
                            o = {error: s}
                        } finally {
                            try {
                                r && !r.done && (i = n.return) && (yield i.call(n))
                            } finally {
                                if (o) throw o.error
                            }
                        }
                        t.complete()
                    })
                })(e, t).catch(n => t.error(n))
            })
        }

        function Lt(e, t, n, r = 0, o = !1) {
            const i = t.schedule(function () {
                n(), o ? e.add(this.schedule(null, r)) : this.unsubscribe()
            }, r);
            if (e.add(i), !o) return i
        }

        function De(e, t, n = 1 / 0) {
            return Q(t) ? De((r, o) => q((i, s) => t(r, i, o, s))(et(e(r, o))), n) : ("number" == typeof t && (n = t), fe((r, o) => function VE(e, t, n, r, o, i, s, a) {
                const u = [];
                let c = 0, l = 0, d = !1;
                const f = () => {
                    d && !u.length && !c && t.complete()
                }, h = g => c < r ? p(g) : u.push(g), p = g => {
                    i && t.next(g), c++;
                    let v = !1;
                    et(n(g, l++)).subscribe(he(t, D => {
                        o?.(D), i ? h(D) : t.next(D)
                    }, () => {
                        v = !0
                    }, void 0, () => {
                        if (v) try {
                            for (c--; u.length && c < r;) {
                                const D = u.shift();
                                s ? Lt(t, s, () => p(D)) : p(D)
                            }
                            f()
                        } catch (D) {
                            t.error(D)
                        }
                    }))
                };
                return e.subscribe(he(t, h, () => {
                    d = !0, f()
                })), () => {
                    a?.()
                }
            }(r, o, e, n)))
        }

        function Gn(e = 1 / 0) {
            return De(nn, e)
        }

        const Et = new le(e => e.complete());

        function ou(e) {
            return e[e.length - 1]
        }

        function so(e) {
            return function UE(e) {
                return e && Q(e.schedule)
            }(ou(e)) ? e.pop() : void 0
        }

        function xf(e, t = 0) {
            return fe((n, r) => {
                n.subscribe(he(r, o => Lt(r, e, () => r.next(o), t), () => Lt(r, e, () => r.complete(), t), o => Lt(r, e, () => r.error(o), t)))
            })
        }

        function Of(e, t = 0) {
            return fe((n, r) => {
                r.add(e.schedule(() => n.subscribe(r), t))
            })
        }

        function Pf(e, t) {
            if (!e) throw new Error("Iterable cannot be null");
            return new le(n => {
                Lt(n, t, () => {
                    const r = e[Symbol.asyncIterator]();
                    Lt(n, t, () => {
                        r.next().then(o => {
                            o.done ? n.complete() : n.next(o.value)
                        })
                    }, 0, !0)
                })
            })
        }

        function ve(e, t) {
            return t ? function XE(e, t) {
                if (null != e) {
                    if (bf(e)) return function qE(e, t) {
                        return et(e).pipe(Of(t), xf(t))
                    }(e, t);
                    if (Ef(e)) return function ZE(e, t) {
                        return new le(n => {
                            let r = 0;
                            return t.schedule(function () {
                                r === e.length ? n.complete() : (n.next(e[r++]), n.closed || this.schedule())
                            })
                        })
                    }(e, t);
                    if (If(e)) return function WE(e, t) {
                        return et(e).pipe(Of(t), xf(t))
                    }(e, t);
                    if (_f(e)) return Pf(e, t);
                    if (Tf(e)) return function YE(e, t) {
                        return new le(n => {
                            let r;
                            return Lt(n, t, () => {
                                r = e[Mf](), Lt(n, t, () => {
                                    let o, i;
                                    try {
                                        ({value: o, done: i} = r.next())
                                    } catch (s) {
                                        return void n.error(s)
                                    }
                                    i ? n.complete() : n.next(o)
                                }, 0, !0)
                            }), () => Q(r?.return) && r.return()
                        })
                    }(e, t);
                    if (Nf(e)) return function QE(e, t) {
                        return Pf(Af(e), t)
                    }(e, t)
                }
                throw Sf(e)
            }(e, t) : et(e)
        }

        class tt extends lt {
            constructor(t) {
                super(), this._value = t
            }

            get value() {
                return this.getValue()
            }

            _subscribe(t) {
                const n = super._subscribe(t);
                return !n.closed && t.next(this._value), n
            }

            getValue() {
                const {hasError: t, thrownError: n, _value: r} = this;
                if (t) throw n;
                return this._throwIfClosed(), r
            }

            next(t) {
                super.next(this._value = t)
            }
        }

        function A(...e) {
            return ve(e, so(e))
        }

        function Ff(e = {}) {
            const {
                connector: t = (() => new lt),
                resetOnError: n = !0,
                resetOnComplete: r = !0,
                resetOnRefCountZero: o = !0
            } = e;
            return i => {
                let s, a, u, c = 0, l = !1, d = !1;
                const f = () => {
                    a?.unsubscribe(), a = void 0
                }, h = () => {
                    f(), s = u = void 0, l = d = !1
                }, p = () => {
                    const g = s;
                    h(), g?.unsubscribe()
                };
                return fe((g, v) => {
                    c++, !d && !l && f();
                    const D = u = u ?? t();
                    v.add(() => {
                        c--, 0 === c && !d && !l && (a = iu(p, o))
                    }), D.subscribe(v), !s && c > 0 && (s = new io({
                        next: m => D.next(m), error: m => {
                            d = !0, f(), a = iu(h, n, m), D.error(m)
                        }, complete: () => {
                            l = !0, f(), a = iu(h, r), D.complete()
                        }
                    }), et(g).subscribe(s))
                })(i)
            }
        }

        function iu(e, t, ...n) {
            if (!0 === t) return void e();
            if (!1 === t) return;
            const r = new io({
                next: () => {
                    r.unsubscribe(), e()
                }
            });
            return et(t(...n)).subscribe(r)
        }

        function dt(e, t) {
            return fe((n, r) => {
                let o = null, i = 0, s = !1;
                const a = () => s && !o && r.complete();
                n.subscribe(he(r, u => {
                    o?.unsubscribe();
                    let c = 0;
                    const l = i++;
                    et(e(u, l)).subscribe(o = he(r, d => r.next(t ? t(u, d, l, c++) : d), () => {
                        o = null, a()
                    }))
                }, () => {
                    s = !0, a()
                }))
            })
        }

        function eI(e, t) {
            return e === t
        }

        function Z(e) {
            for (let t in e) if (e[t] === Z) return t;
            throw Error("Could not find renamed property on target object.")
        }

        function pe(e) {
            if ("string" == typeof e) return e;
            if (Array.isArray(e)) return "[" + e.map(pe).join(", ") + "]";
            if (null == e) return "" + e;
            if (e.overriddenName) return `${e.overriddenName}`;
            if (e.name) return `${e.name}`;
            const t = e.toString();
            if (null == t) return "" + t;
            const n = t.indexOf("\n");
            return -1 === n ? t : t.substring(0, n)
        }

        function su(e, t) {
            return null == e || "" === e ? null === t ? "" : t : null == t || "" === t ? e : e + " " + t
        }

        const tI = Z({__forward_ref__: Z});

        function au(e) {
            return e.__forward_ref__ = au, e.toString = function () {
                return pe(this())
            }, e
        }

        function x(e) {
            return uu(e) ? e() : e
        }

        function uu(e) {
            return "function" == typeof e && e.hasOwnProperty(tI) && e.__forward_ref__ === au
        }

        function cu(e) {
            return e && !!e.\u0275providers
        }

        class w extends Error {
            constructor(t, n) {
                super(function xi(e, t) {
                    return `NG0${Math.abs(e)}${t ? ": " + t : ""}`
                }(t, n)), this.code = t
            }
        }

        function O(e) {
            return "string" == typeof e ? e : null == e ? "" : String(e)
        }

        function lu(e, t) {
            throw new w(-201, !1)
        }

        function nt(e, t) {
            null == e && function N(e, t, n, r) {
                throw new Error(`ASSERTION ERROR: ${e}` + (null == r ? "" : ` [Expected=> ${n} ${r} ${t} <=Actual]`))
            }(t, e, null, "!=")
        }

        function S(e) {
            return {token: e.token, providedIn: e.providedIn || null, factory: e.factory, value: void 0}
        }

        function jt(e) {
            return {providers: e.providers || [], imports: e.imports || []}
        }

        function Oi(e) {
            return Lf(e, Fi) || Lf(e, jf)
        }

        function Lf(e, t) {
            return e.hasOwnProperty(t) ? e[t] : null
        }

        function Pi(e) {
            return e && (e.hasOwnProperty(du) || e.hasOwnProperty(cI)) ? e[du] : null
        }

        const Fi = Z({\u0275prov: Z}), du = Z({\u0275inj: Z}), jf = Z({ngInjectableDef: Z}), cI = Z({ngInjectorDef: Z});
        var $ = function (e) {
            return e[e.Default = 0] = "Default", e[e.Host = 1] = "Host", e[e.Self = 2] = "Self", e[e.SkipSelf = 4] = "SkipSelf", e[e.Optional = 8] = "Optional", e
        }($ || {});
        let fu;

        function je(e) {
            const t = fu;
            return fu = e, t
        }

        function Hf(e, t, n) {
            const r = Oi(e);
            return r && "root" == r.providedIn ? void 0 === r.value ? r.value = r.factory() : r.value : n & $.Optional ? null : void 0 !== t ? t : void lu(pe(e))
        }

        const J = globalThis;

        class b {
            constructor(t, n) {
                this._desc = t, this.ngMetadataName = "InjectionToken", this.\u0275prov = void 0, "number" == typeof n ? this.__NG_ELEMENT_ID__ = n : void 0 !== n && (this.\u0275prov = S({
                    token: this,
                    providedIn: n.providedIn || "root",
                    factory: n.factory
                }))
            }

            get multi() {
                return this
            }

            toString() {
                return `InjectionToken ${this._desc}`
            }
        }

        const ao = {}, vu = "__NG_DI_FLAG__", ki = "ngTempTokenPath", fI = /\n/gm, Bf = "__source";
        let qn;

        function on(e) {
            const t = qn;
            return qn = e, t
        }

        function gI(e, t = $.Default) {
            if (void 0 === qn) throw new w(-203, !1);
            return null === qn ? Hf(e, void 0, t) : qn.get(e, t & $.Optional ? null : void 0, t)
        }

        function _(e, t = $.Default) {
            return (function $f() {
                return fu
            }() || gI)(x(e), t)
        }

        function I(e, t = $.Default) {
            return _(e, Li(t))
        }

        function Li(e) {
            return typeof e > "u" || "number" == typeof e ? e : 0 | (e.optional && 8) | (e.host && 1) | (e.self && 2) | (e.skipSelf && 4)
        }

        function yu(e) {
            const t = [];
            for (let n = 0; n < e.length; n++) {
                const r = x(e[n]);
                if (Array.isArray(r)) {
                    if (0 === r.length) throw new w(900, !1);
                    let o, i = $.Default;
                    for (let s = 0; s < r.length; s++) {
                        const a = r[s], u = mI(a);
                        "number" == typeof u ? -1 === u ? o = a.token : i |= u : o = a
                    }
                    t.push(_(o, i))
                } else t.push(_(r))
            }
            return t
        }

        function uo(e, t) {
            return e[vu] = t, e.prototype[vu] = t, e
        }

        function mI(e) {
            return e[vu]
        }

        function $t(e) {
            return {toString: e}.toString()
        }

        var ji = function (e) {
            return e[e.OnPush = 0] = "OnPush", e[e.Default = 1] = "Default", e
        }(ji || {}), ft = function (e) {
            return e[e.Emulated = 0] = "Emulated", e[e.None = 2] = "None", e[e.ShadowDom = 3] = "ShadowDom", e
        }(ft || {});
        const It = {}, U = [], $i = Z({\u0275cmp: Z}), Du = Z({\u0275dir: Z}), wu = Z({\u0275pipe: Z}),
            zf = Z({\u0275mod: Z}), Ht = Z({\u0275fac: Z}), co = Z({__NG_ELEMENT_ID__: Z}), Gf = Z({__NG_ENV_ID__: Z});

        function qf(e, t, n) {
            let r = e.length;
            for (; ;) {
                const o = e.indexOf(t, n);
                if (-1 === o) return o;
                if (0 === o || e.charCodeAt(o - 1) <= 32) {
                    const i = t.length;
                    if (o + i === r || e.charCodeAt(o + i) <= 32) return o
                }
                n = o + 1
            }
        }

        function Cu(e, t, n) {
            let r = 0;
            for (; r < n.length;) {
                const o = n[r];
                if ("number" == typeof o) {
                    if (0 !== o) break;
                    r++;
                    const i = n[r++], s = n[r++], a = n[r++];
                    e.setAttribute(t, s, a, i)
                } else {
                    const i = o, s = n[++r];
                    Zf(i) ? e.setProperty(t, i, s) : e.setAttribute(t, i, s), r++
                }
            }
            return r
        }

        function Wf(e) {
            return 3 === e || 4 === e || 6 === e
        }

        function Zf(e) {
            return 64 === e.charCodeAt(0)
        }

        function lo(e, t) {
            if (null !== t && 0 !== t.length) if (null === e || 0 === e.length) e = t.slice(); else {
                let n = -1;
                for (let r = 0; r < t.length; r++) {
                    const o = t[r];
                    "number" == typeof o ? n = o : 0 === n || Yf(e, n, o, null, -1 === n || 2 === n ? t[++r] : null)
                }
            }
            return e
        }

        function Yf(e, t, n, r, o) {
            let i = 0, s = e.length;
            if (-1 === t) s = -1; else for (; i < e.length;) {
                const a = e[i++];
                if ("number" == typeof a) {
                    if (a === t) {
                        s = -1;
                        break
                    }
                    if (a > t) {
                        s = i - 1;
                        break
                    }
                }
            }
            for (; i < e.length;) {
                const a = e[i];
                if ("number" == typeof a) break;
                if (a === n) {
                    if (null === r) return void (null !== o && (e[i + 1] = o));
                    if (r === e[i + 1]) return void (e[i + 2] = o)
                }
                i++, null !== r && i++, null !== o && i++
            }
            -1 !== s && (e.splice(s, 0, t), i = s + 1), e.splice(i++, 0, n), null !== r && e.splice(i++, 0, r), null !== o && e.splice(i++, 0, o)
        }

        const Qf = "ng-template";

        function DI(e, t, n) {
            let r = 0, o = !0;
            for (; r < e.length;) {
                let i = e[r++];
                if ("string" == typeof i && o) {
                    const s = e[r++];
                    if (n && "class" === i && -1 !== qf(s.toLowerCase(), t, 0)) return !0
                } else {
                    if (1 === i) {
                        for (; r < e.length && "string" == typeof (i = e[r++]);) if (i.toLowerCase() === t) return !0;
                        return !1
                    }
                    "number" == typeof i && (o = !1)
                }
            }
            return !1
        }

        function Xf(e) {
            return 4 === e.type && e.value !== Qf
        }

        function wI(e, t, n) {
            return t === (4 !== e.type || n ? e.value : Qf)
        }

        function CI(e, t, n) {
            let r = 4;
            const o = e.attrs || [], i = function bI(e) {
                for (let t = 0; t < e.length; t++) if (Wf(e[t])) return t;
                return e.length
            }(o);
            let s = !1;
            for (let a = 0; a < t.length; a++) {
                const u = t[a];
                if ("number" != typeof u) {
                    if (!s) if (4 & r) {
                        if (r = 2 | 1 & r, "" !== u && !wI(e, u, n) || "" === u && 1 === t.length) {
                            if (ht(r)) return !1;
                            s = !0
                        }
                    } else {
                        const c = 8 & r ? u : t[++a];
                        if (8 & r && null !== e.attrs) {
                            if (!DI(e.attrs, c, n)) {
                                if (ht(r)) return !1;
                                s = !0
                            }
                            continue
                        }
                        const d = EI(8 & r ? "class" : u, o, Xf(e), n);
                        if (-1 === d) {
                            if (ht(r)) return !1;
                            s = !0;
                            continue
                        }
                        if ("" !== c) {
                            let f;
                            f = d > i ? "" : o[d + 1].toLowerCase();
                            const h = 8 & r ? f : null;
                            if (h && -1 !== qf(h, c, 0) || 2 & r && c !== f) {
                                if (ht(r)) return !1;
                                s = !0
                            }
                        }
                    }
                } else {
                    if (!s && !ht(r) && !ht(u)) return !1;
                    if (s && ht(u)) continue;
                    s = !1, r = u | 1 & r
                }
            }
            return ht(r) || s
        }

        function ht(e) {
            return 0 == (1 & e)
        }

        function EI(e, t, n, r) {
            if (null === t) return -1;
            let o = 0;
            if (r || !n) {
                let i = !1;
                for (; o < t.length;) {
                    const s = t[o];
                    if (s === e) return o;
                    if (3 === s || 6 === s) i = !0; else {
                        if (1 === s || 2 === s) {
                            let a = t[++o];
                            for (; "string" == typeof a;) a = t[++o];
                            continue
                        }
                        if (4 === s) break;
                        if (0 === s) {
                            o += 4;
                            continue
                        }
                    }
                    o += i ? 1 : 2
                }
                return -1
            }
            return function _I(e, t) {
                let n = e.indexOf(4);
                if (n > -1) for (n++; n < e.length;) {
                    const r = e[n];
                    if ("number" == typeof r) return -1;
                    if (r === t) return n;
                    n++
                }
                return -1
            }(t, e)
        }

        function Jf(e, t, n = !1) {
            for (let r = 0; r < t.length; r++) if (CI(e, t[r], n)) return !0;
            return !1
        }

        function Kf(e, t) {
            return e ? ":not(" + t.trim() + ")" : t
        }

        function MI(e) {
            let t = e[0], n = 1, r = 2, o = "", i = !1;
            for (; n < e.length;) {
                let s = e[n];
                if ("string" == typeof s) if (2 & r) {
                    const a = e[++n];
                    o += "[" + s + (a.length > 0 ? '="' + a + '"' : "") + "]"
                } else 8 & r ? o += "." + s : 4 & r && (o += " " + s); else "" !== o && !ht(s) && (t += Kf(i, o), o = ""), r = s, i = i || !ht(r);
                n++
            }
            return "" !== o && (t += Kf(i, o)), t
        }

        function Hi(e) {
            return $t(() => {
                const t = th(e), n = {
                    ...t,
                    decls: e.decls,
                    vars: e.vars,
                    template: e.template,
                    consts: e.consts || null,
                    ngContentSelectors: e.ngContentSelectors,
                    onPush: e.changeDetection === ji.OnPush,
                    directiveDefs: null,
                    pipeDefs: null,
                    dependencies: t.standalone && e.dependencies || null,
                    getStandaloneInjector: null,
                    signals: e.signals ?? !1,
                    data: e.data || {},
                    encapsulation: e.encapsulation || ft.Emulated,
                    styles: e.styles || U,
                    _: null,
                    schemas: e.schemas || null,
                    tView: null,
                    id: ""
                };
                nh(n);
                const r = e.dependencies;
                return n.directiveDefs = Vi(r, !1), n.pipeDefs = Vi(r, !0), n.id = function FI(e) {
                    let t = 0;
                    const n = [e.selectors, e.ngContentSelectors, e.hostVars, e.hostAttrs, e.consts, e.vars, e.decls, e.encapsulation, e.standalone, e.signals, e.exportAs, JSON.stringify(e.inputs), JSON.stringify(e.outputs), Object.getOwnPropertyNames(e.type.prototype), !!e.contentQueries, !!e.viewQuery].join("|");
                    for (const o of n) t = Math.imul(31, t) + o.charCodeAt(0) << 0;
                    return t += 2147483648, "c" + t
                }(n), n
            })
        }

        function RI(e) {
            return V(e) || we(e)
        }

        function xI(e) {
            return null !== e
        }

        function sn(e) {
            return $t(() => ({
                type: e.type,
                bootstrap: e.bootstrap || U,
                declarations: e.declarations || U,
                imports: e.imports || U,
                exports: e.exports || U,
                transitiveCompileScopes: null,
                schemas: e.schemas || null,
                id: e.id || null
            }))
        }

        function eh(e, t) {
            if (null == e) return It;
            const n = {};
            for (const r in e) if (e.hasOwnProperty(r)) {
                let o = e[r], i = o;
                Array.isArray(o) && (i = o[1], o = o[0]), n[o] = r, t && (t[o] = i)
            }
            return n
        }

        function Te(e) {
            return $t(() => {
                const t = th(e);
                return nh(t), t
            })
        }

        function V(e) {
            return e[$i] || null
        }

        function we(e) {
            return e[Du] || null
        }

        function Ae(e) {
            return e[wu] || null
        }

        function We(e, t) {
            const n = e[zf] || null;
            if (!n && !0 === t) throw new Error(`Type ${pe(e)} does not have '\u0275mod' property.`);
            return n
        }

        function th(e) {
            const t = {};
            return {
                type: e.type,
                providersResolver: null,
                factory: null,
                hostBindings: e.hostBindings || null,
                hostVars: e.hostVars || 0,
                hostAttrs: e.hostAttrs || null,
                contentQueries: e.contentQueries || null,
                declaredInputs: t,
                inputTransforms: null,
                inputConfig: e.inputs || It,
                exportAs: e.exportAs || null,
                standalone: !0 === e.standalone,
                signals: !0 === e.signals,
                selectors: e.selectors || U,
                viewQuery: e.viewQuery || null,
                features: e.features || null,
                setInput: null,
                findHostDirectiveDefs: null,
                hostDirectives: null,
                inputs: eh(e.inputs, t),
                outputs: eh(e.outputs)
            }
        }

        function nh(e) {
            e.features?.forEach(t => t(e))
        }

        function Vi(e, t) {
            if (!e) return null;
            const n = t ? Ae : RI;
            return () => ("function" == typeof e ? e() : e).map(r => n(r)).filter(xI)
        }

        const ie = 0, C = 1, k = 2, re = 3, pt = 4, fo = 5, be = 6, Zn = 7, ae = 8, an = 9, Yn = 10, P = 11, ho = 12,
            rh = 13, Qn = 14, ue = 15, po = 16, Xn = 17, bt = 18, go = 19, oh = 20, un = 21, Vt = 22, mo = 23, vo = 24,
            H = 25, Eu = 1, ih = 2, _t = 7, Jn = 9, Ce = 11;

        function He(e) {
            return Array.isArray(e) && "object" == typeof e[Eu]
        }

        function Ne(e) {
            return Array.isArray(e) && !0 === e[Eu]
        }

        function Iu(e) {
            return 0 != (4 & e.flags)
        }

        function _n(e) {
            return e.componentOffset > -1
        }

        function Ui(e) {
            return 1 == (1 & e.flags)
        }

        function gt(e) {
            return !!e.template
        }

        function bu(e) {
            return 0 != (512 & e[k])
        }

        function Sn(e, t) {
            return e.hasOwnProperty(Ht) ? e[Ht] : null
        }

        let Ee = null, zi = !1;

        function rt(e) {
            const t = Ee;
            return Ee = e, t
        }

        const uh = {
            version: 0,
            dirty: !1,
            producerNode: void 0,
            producerLastReadVersion: void 0,
            producerIndexOfThis: void 0,
            nextProducerIndex: 0,
            liveConsumerNode: void 0,
            liveConsumerIndexOfThis: void 0,
            consumerAllowSignalWrites: !1,
            consumerIsAlwaysLive: !1,
            producerMustRecompute: () => !1,
            producerRecomputeValue: () => {
            },
            consumerMarkedDirty: () => {
            }
        };

        function lh(e) {
            if (!Do(e) || e.dirty) {
                if (!e.producerMustRecompute(e) && !hh(e)) return void (e.dirty = !1);
                e.producerRecomputeValue(e), e.dirty = !1
            }
        }

        function fh(e) {
            e.dirty = !0, function dh(e) {
                if (void 0 === e.liveConsumerNode) return;
                const t = zi;
                zi = !0;
                try {
                    for (const n of e.liveConsumerNode) n.dirty || fh(n)
                } finally {
                    zi = t
                }
            }(e), e.consumerMarkedDirty?.(e)
        }

        function Su(e) {
            return e && (e.nextProducerIndex = 0), rt(e)
        }

        function Mu(e, t) {
            if (rt(t), e && void 0 !== e.producerNode && void 0 !== e.producerIndexOfThis && void 0 !== e.producerLastReadVersion) {
                if (Do(e)) for (let n = e.nextProducerIndex; n < e.producerNode.length; n++) Gi(e.producerNode[n], e.producerIndexOfThis[n]);
                for (; e.producerNode.length > e.nextProducerIndex;) e.producerNode.pop(), e.producerLastReadVersion.pop(), e.producerIndexOfThis.pop()
            }
        }

        function hh(e) {
            Kn(e);
            for (let t = 0; t < e.producerNode.length; t++) {
                const n = e.producerNode[t], r = e.producerLastReadVersion[t];
                if (r !== n.version || (lh(n), r !== n.version)) return !0
            }
            return !1
        }

        function ph(e) {
            if (Kn(e), Do(e)) for (let t = 0; t < e.producerNode.length; t++) Gi(e.producerNode[t], e.producerIndexOfThis[t]);
            e.producerNode.length = e.producerLastReadVersion.length = e.producerIndexOfThis.length = 0, e.liveConsumerNode && (e.liveConsumerNode.length = e.liveConsumerIndexOfThis.length = 0)
        }

        function Gi(e, t) {
            if (function mh(e) {
                e.liveConsumerNode ??= [], e.liveConsumerIndexOfThis ??= []
            }(e), Kn(e), 1 === e.liveConsumerNode.length) for (let r = 0; r < e.producerNode.length; r++) Gi(e.producerNode[r], e.producerIndexOfThis[r]);
            const n = e.liveConsumerNode.length - 1;
            if (e.liveConsumerNode[t] = e.liveConsumerNode[n], e.liveConsumerIndexOfThis[t] = e.liveConsumerIndexOfThis[n], e.liveConsumerNode.length--, e.liveConsumerIndexOfThis.length--, t < e.liveConsumerNode.length) {
                const r = e.liveConsumerIndexOfThis[t], o = e.liveConsumerNode[t];
                Kn(o), o.producerIndexOfThis[r] = t
            }
        }

        function Do(e) {
            return e.consumerIsAlwaysLive || (e?.liveConsumerNode?.length ?? 0) > 0
        }

        function Kn(e) {
            e.producerNode ??= [], e.producerIndexOfThis ??= [], e.producerLastReadVersion ??= []
        }

        let vh = null;
        const Ch = () => {
        }, ZI = (() => ({
            ...uh, consumerIsAlwaysLive: !0, consumerAllowSignalWrites: !1, consumerMarkedDirty: e => {
                e.schedule(e.ref)
            }, hasRun: !1, cleanupFn: Ch
        }))();

        class YI {
            constructor(t, n, r) {
                this.previousValue = t, this.currentValue = n, this.firstChange = r
            }

            isFirstChange() {
                return this.firstChange
            }
        }

        function Mn() {
            return Eh
        }

        function Eh(e) {
            return e.type.prototype.ngOnChanges && (e.setInput = XI), QI
        }

        function QI() {
            const e = bh(this), t = e?.current;
            if (t) {
                const n = e.previous;
                if (n === It) e.previous = t; else for (let r in t) n[r] = t[r];
                e.current = null, this.ngOnChanges(t)
            }
        }

        function XI(e, t, n, r) {
            const o = this.declaredInputs[n], i = bh(e) || function JI(e, t) {
                return e[Ih] = t
            }(e, {previous: It, current: null}), s = i.current || (i.current = {}), a = i.previous, u = a[o];
            s[o] = new YI(u && u.currentValue, t, a === It), e[r] = t
        }

        Mn.ngInherit = !0;
        const Ih = "__ngSimpleChanges__";

        function bh(e) {
            return e[Ih] || null
        }

        const St = function (e, t, n) {
        };

        function K(e) {
            for (; Array.isArray(e);) e = e[ie];
            return e
        }

        function Ve(e, t) {
            return K(t[e.index])
        }

        function Mh(e, t) {
            return e.data[t]
        }

        function Ze(e, t) {
            const n = t[e];
            return He(n) ? n : n[ie]
        }

        function ln(e, t) {
            return null == t ? null : e[t]
        }

        function Th(e) {
            e[Xn] = 0
        }

        function ob(e) {
            1024 & e[k] || (e[k] |= 1024, Nh(e, 1))
        }

        function Ah(e) {
            1024 & e[k] && (e[k] &= -1025, Nh(e, -1))
        }

        function Nh(e, t) {
            let n = e[re];
            if (null === n) return;
            n[fo] += t;
            let r = n;
            for (n = n[re]; null !== n && (1 === t && 1 === r[fo] || -1 === t && 0 === r[fo]);) n[fo] += t, r = n, n = n[re]
        }

        const R = {lFrame: Vh(null), bindingsEnabled: !0, skipHydrationRootTNode: null};

        function Oh() {
            return R.bindingsEnabled
        }

        function y() {
            return R.lFrame.lView
        }

        function B() {
            return R.lFrame.tView
        }

        function Ie() {
            let e = Ph();
            for (; null !== e && 64 === e.type;) e = e.parent;
            return e
        }

        function Ph() {
            return R.lFrame.currentTNode
        }

        function Mt(e, t) {
            const n = R.lFrame;
            n.currentTNode = e, n.isParent = t
        }

        function xu() {
            return R.lFrame.isParent
        }

        function nr() {
            return R.lFrame.bindingIndex++
        }

        function yb(e, t) {
            const n = R.lFrame;
            n.bindingIndex = n.bindingRootIndex = e, Pu(t)
        }

        function Pu(e) {
            R.lFrame.currentDirectiveIndex = e
        }

        function ku(e) {
            R.lFrame.currentQueryIndex = e
        }

        function wb(e) {
            const t = e[C];
            return 2 === t.type ? t.declTNode : 1 === t.type ? e[be] : null
        }

        function $h(e, t, n) {
            if (n & $.SkipSelf) {
                let o = t, i = e;
                for (; !(o = o.parent, null !== o || n & $.Host || (o = wb(i), null === o || (i = i[Qn], 10 & o.type)));) ;
                if (null === o) return !1;
                t = o, e = i
            }
            const r = R.lFrame = Hh();
            return r.currentTNode = t, r.lView = e, !0
        }

        function Lu(e) {
            const t = Hh(), n = e[C];
            R.lFrame = t, t.currentTNode = n.firstChild, t.lView = e, t.tView = n, t.contextLView = e, t.bindingIndex = n.bindingStartIndex, t.inI18n = !1
        }

        function Hh() {
            const e = R.lFrame, t = null === e ? null : e.child;
            return null === t ? Vh(e) : t
        }

        function Vh(e) {
            const t = {
                currentTNode: null,
                isParent: !0,
                lView: null,
                tView: null,
                selectedIndex: -1,
                contextLView: null,
                elementDepthCount: 0,
                currentNamespace: null,
                currentDirectiveIndex: -1,
                bindingRootIndex: -1,
                bindingIndex: -1,
                currentQueryIndex: 0,
                parent: e,
                child: null,
                inI18n: !1
            };
            return null !== e && (e.child = t), t
        }

        function Bh() {
            const e = R.lFrame;
            return R.lFrame = e.parent, e.currentTNode = null, e.lView = null, e
        }

        const Uh = Bh;

        function ju() {
            const e = Bh();
            e.isParent = !0, e.tView = null, e.selectedIndex = -1, e.contextLView = null, e.elementDepthCount = 0, e.currentDirectiveIndex = -1, e.currentNamespace = null, e.bindingRootIndex = -1, e.bindingIndex = -1, e.currentQueryIndex = 0
        }

        function xe() {
            return R.lFrame.selectedIndex
        }

        function Tn(e) {
            R.lFrame.selectedIndex = e
        }

        let Gh = !0;

        function Wi() {
            return Gh
        }

        function dn(e) {
            Gh = e
        }

        function Zi(e, t) {
            for (let n = t.directiveStart, r = t.directiveEnd; n < r; n++) {
                const i = e.data[n].type.prototype, {
                    ngAfterContentInit: s,
                    ngAfterContentChecked: a,
                    ngAfterViewInit: u,
                    ngAfterViewChecked: c,
                    ngOnDestroy: l
                } = i;
                s && (e.contentHooks ??= []).push(-n, s), a && ((e.contentHooks ??= []).push(n, a), (e.contentCheckHooks ??= []).push(n, a)), u && (e.viewHooks ??= []).push(-n, u), c && ((e.viewHooks ??= []).push(n, c), (e.viewCheckHooks ??= []).push(n, c)), null != l && (e.destroyHooks ??= []).push(n, l)
            }
        }

        function Yi(e, t, n) {
            qh(e, t, 3, n)
        }

        function Qi(e, t, n, r) {
            (3 & e[k]) === n && qh(e, t, n, r)
        }

        function $u(e, t) {
            let n = e[k];
            (3 & n) === t && (n &= 8191, n += 1, e[k] = n)
        }

        function qh(e, t, n, r) {
            const i = r ?? -1, s = t.length - 1;
            let a = 0;
            for (let u = void 0 !== r ? 65535 & e[Xn] : 0; u < s; u++) if ("number" == typeof t[u + 1]) {
                if (a = t[u], null != r && a >= r) break
            } else t[u] < 0 && (e[Xn] += 65536), (a < i || -1 == i) && (Tb(e, n, t, u), e[Xn] = (4294901760 & e[Xn]) + u + 2), u++
        }

        function Wh(e, t) {
            St(4, e, t);
            const n = rt(null);
            try {
                t.call(e)
            } finally {
                rt(n), St(5, e, t)
            }
        }

        function Tb(e, t, n, r) {
            const o = n[r] < 0, i = n[r + 1], a = e[o ? -n[r] : n[r]];
            o ? e[k] >> 13 < e[Xn] >> 16 && (3 & e[k]) === t && (e[k] += 8192, Wh(a, i)) : Wh(a, i)
        }

        const rr = -1;

        class Co {
            constructor(t, n, r) {
                this.factory = t, this.resolving = !1, this.canSeeViewProviders = n, this.injectImpl = r
            }
        }

        function Vu(e) {
            return e !== rr
        }

        function Eo(e) {
            return 32767 & e
        }

        function Io(e, t) {
            let n = function xb(e) {
                return e >> 16
            }(e), r = t;
            for (; n > 0;) r = r[Qn], n--;
            return r
        }

        let Bu = !0;

        function Xi(e) {
            const t = Bu;
            return Bu = e, t
        }

        const Zh = 255, Yh = 5;
        let Ob = 0;
        const Tt = {};

        function Ji(e, t) {
            const n = Qh(e, t);
            if (-1 !== n) return n;
            const r = t[C];
            r.firstCreatePass && (e.injectorIndex = t.length, Uu(r.data, e), Uu(t, null), Uu(r.blueprint, null));
            const o = Ki(e, t), i = e.injectorIndex;
            if (Vu(o)) {
                const s = Eo(o), a = Io(o, t), u = a[C].data;
                for (let c = 0; c < 8; c++) t[i + c] = a[s + c] | u[s + c]
            }
            return t[i + 8] = o, i
        }

        function Uu(e, t) {
            e.push(0, 0, 0, 0, 0, 0, 0, 0, t)
        }

        function Qh(e, t) {
            return -1 === e.injectorIndex || e.parent && e.parent.injectorIndex === e.injectorIndex || null === t[e.injectorIndex + 8] ? -1 : e.injectorIndex
        }

        function Ki(e, t) {
            if (e.parent && -1 !== e.parent.injectorIndex) return e.parent.injectorIndex;
            let n = 0, r = null, o = t;
            for (; null !== o;) {
                if (r = op(o), null === r) return rr;
                if (n++, o = o[Qn], -1 !== r.injectorIndex) return r.injectorIndex | n << 16
            }
            return rr
        }

        function zu(e, t, n) {
            !function Pb(e, t, n) {
                let r;
                "string" == typeof n ? r = n.charCodeAt(0) || 0 : n.hasOwnProperty(co) && (r = n[co]), null == r && (r = n[co] = Ob++);
                const o = r & Zh;
                t.data[e + (o >> Yh)] |= 1 << o
            }(e, t, n)
        }

        function Xh(e, t, n) {
            if (n & $.Optional || void 0 !== e) return e;
            lu()
        }

        function Jh(e, t, n, r) {
            if (n & $.Optional && void 0 === r && (r = null), !(n & ($.Self | $.Host))) {
                const o = e[an], i = je(void 0);
                try {
                    return o ? o.get(t, r, n & $.Optional) : Hf(t, r, n & $.Optional)
                } finally {
                    je(i)
                }
            }
            return Xh(r, 0, n)
        }

        function Kh(e, t, n, r = $.Default, o) {
            if (null !== e) {
                if (2048 & t[k] && !(r & $.Self)) {
                    const s = function Hb(e, t, n, r, o) {
                        let i = e, s = t;
                        for (; null !== i && null !== s && 2048 & s[k] && !(512 & s[k]);) {
                            const a = ep(i, s, n, r | $.Self, Tt);
                            if (a !== Tt) return a;
                            let u = i.parent;
                            if (!u) {
                                const c = s[oh];
                                if (c) {
                                    const l = c.get(n, Tt, r);
                                    if (l !== Tt) return l
                                }
                                u = op(s), s = s[Qn]
                            }
                            i = u
                        }
                        return o
                    }(e, t, n, r, Tt);
                    if (s !== Tt) return s
                }
                const i = ep(e, t, n, r, Tt);
                if (i !== Tt) return i
            }
            return Jh(t, n, r, o)
        }

        function ep(e, t, n, r, o) {
            const i = function Lb(e) {
                if ("string" == typeof e) return e.charCodeAt(0) || 0;
                const t = e.hasOwnProperty(co) ? e[co] : void 0;
                return "number" == typeof t ? t >= 0 ? t & Zh : $b : t
            }(n);
            if ("function" == typeof i) {
                if (!$h(t, e, r)) return r & $.Host ? Xh(o, 0, r) : Jh(t, n, r, o);
                try {
                    let s;
                    if (s = i(r), null != s || r & $.Optional) return s;
                    lu()
                } finally {
                    Uh()
                }
            } else if ("number" == typeof i) {
                let s = null, a = Qh(e, t), u = rr, c = r & $.Host ? t[ue][be] : null;
                for ((-1 === a || r & $.SkipSelf) && (u = -1 === a ? Ki(e, t) : t[a + 8], u !== rr && np(r, !1) ? (s = t[C], a = Eo(u), t = Io(u, t)) : a = -1); -1 !== a;) {
                    const l = t[C];
                    if (tp(i, a, l.data)) {
                        const d = kb(a, t, n, s, r, c);
                        if (d !== Tt) return d
                    }
                    u = t[a + 8], u !== rr && np(r, t[C].data[a + 8] === c) && tp(i, a, t) ? (s = l, a = Eo(u), t = Io(u, t)) : a = -1
                }
            }
            return o
        }

        function kb(e, t, n, r, o, i) {
            const s = t[C], a = s.data[e + 8], l = function es(e, t, n, r, o) {
                const i = e.providerIndexes, s = t.data, a = 1048575 & i, u = e.directiveStart, l = i >> 20,
                    f = o ? a + l : e.directiveEnd;
                for (let h = r ? a : a + l; h < f; h++) {
                    const p = s[h];
                    if (h < u && n === p || h >= u && p.type === n) return h
                }
                if (o) {
                    const h = s[u];
                    if (h && gt(h) && h.type === n) return u
                }
                return null
            }(a, s, n, null == r ? _n(a) && Bu : r != s && 0 != (3 & a.type), o & $.Host && i === a);
            return null !== l ? An(t, s, l, a) : Tt
        }

        function An(e, t, n, r) {
            let o = e[n];
            const i = t.data;
            if (function Ab(e) {
                return e instanceof Co
            }(o)) {
                const s = o;
                s.resolving && function nI(e, t) {
                    const n = t ? `. Dependency path: ${t.join(" > ")} > ${e}` : "";
                    throw new w(-200, `Circular dependency in DI detected for ${e}${n}`)
                }(function W(e) {
                    return "function" == typeof e ? e.name || e.toString() : "object" == typeof e && null != e && "function" == typeof e.type ? e.type.name || e.type.toString() : O(e)
                }(i[n]));
                const a = Xi(s.canSeeViewProviders);
                s.resolving = !0;
                const c = s.injectImpl ? je(s.injectImpl) : null;
                $h(e, r, $.Default);
                try {
                    o = e[n] = s.factory(void 0, i, e, r), t.firstCreatePass && n >= r.directiveStart && function Mb(e, t, n) {
                        const {ngOnChanges: r, ngOnInit: o, ngDoCheck: i} = t.type.prototype;
                        if (r) {
                            const s = Eh(t);
                            (n.preOrderHooks ??= []).push(e, s), (n.preOrderCheckHooks ??= []).push(e, s)
                        }
                        o && (n.preOrderHooks ??= []).push(0 - e, o), i && ((n.preOrderHooks ??= []).push(e, i), (n.preOrderCheckHooks ??= []).push(e, i))
                    }(n, i[n], t)
                } finally {
                    null !== c && je(c), Xi(a), s.resolving = !1, Uh()
                }
            }
            return o
        }

        function tp(e, t, n) {
            return !!(n[t + (e >> Yh)] & 1 << e)
        }

        function np(e, t) {
            return !(e & $.Self || e & $.Host && t)
        }

        class Oe {
            constructor(t, n) {
                this._tNode = t, this._lView = n
            }

            get(t, n, r) {
                return Kh(this._tNode, this._lView, t, Li(r), n)
            }
        }

        function $b() {
            return new Oe(Ie(), y())
        }

        function Gu(e) {
            return uu(e) ? () => {
                const t = Gu(x(e));
                return t && t()
            } : Sn(e)
        }

        function op(e) {
            const t = e[C], n = t.type;
            return 2 === n ? t.declTNode : 1 === n ? e[be] : null
        }

        const ir = "__parameters__";

        function ar(e, t, n) {
            return $t(() => {
                const r = function qu(e) {
                    return function (...n) {
                        if (e) {
                            const r = e(...n);
                            for (const o in r) this[o] = r[o]
                        }
                    }
                }(t);

                function o(...i) {
                    if (this instanceof o) return r.apply(this, i), this;
                    const s = new o(...i);
                    return a.annotation = s, a;

                    function a(u, c, l) {
                        const d = u.hasOwnProperty(ir) ? u[ir] : Object.defineProperty(u, ir, {value: []})[ir];
                        for (; d.length <= l;) d.push(null);
                        return (d[l] = d[l] || []).push(s), u
                    }
                }

                return n && (o.prototype = Object.create(n.prototype)), o.prototype.ngMetadataName = e, o.annotationCls = o, o
            })
        }

        function cr(e, t) {
            e.forEach(n => Array.isArray(n) ? cr(n, t) : t(n))
        }

        function sp(e, t, n) {
            t >= e.length ? e.push(n) : e.splice(t, 0, n)
        }

        function ns(e, t) {
            return t >= e.length - 1 ? e.pop() : e.splice(t, 1)[0]
        }

        const os = uo(ar("Optional"), 8), is = uo(ar("SkipSelf"), 4);

        function ls(e) {
            return 128 == (128 & e.flags)
        }

        var fn = function (e) {
            return e[e.Important = 1] = "Important", e[e.DashCase = 2] = "DashCase", e
        }(fn || {});
        const Ju = new Map;
        let v_ = 0;
        const ec = "__ngContext__";

        function _e(e, t) {
            He(t) ? (e[ec] = t[go], function D_(e) {
                Ju.set(e[go], e)
            }(t)) : e[ec] = t
        }

        let tc;

        function nc(e, t) {
            return tc(e, t)
        }

        function Ao(e) {
            const t = e[re];
            return Ne(t) ? t[re] : t
        }

        function Mp(e) {
            return Ap(e[ho])
        }

        function Tp(e) {
            return Ap(e[pt])
        }

        function Ap(e) {
            for (; null !== e && !Ne(e);) e = e[pt];
            return e
        }

        function hr(e, t, n, r, o) {
            if (null != r) {
                let i, s = !1;
                Ne(r) ? i = r : He(r) && (s = !0, r = r[ie]);
                const a = K(r);
                0 === e && null !== n ? null == o ? Op(t, n, a) : Nn(t, n, a, o || null, !0) : 1 === e && null !== n ? Nn(t, n, a, o || null, !0) : 2 === e ? function vs(e, t, n) {
                    const r = gs(e, t);
                    r && function j_(e, t, n, r) {
                        e.removeChild(t, n, r)
                    }(e, r, t, n)
                }(t, a, s) : 3 === e && t.destroyNode(a), null != i && function V_(e, t, n, r, o) {
                    const i = n[_t];
                    i !== K(n) && hr(t, e, r, i, o);
                    for (let a = Ce; a < n.length; a++) {
                        const u = n[a];
                        Ro(u[C], u, e, t, r, i)
                    }
                }(t, e, i, n, o)
            }
        }

        function hs(e, t, n) {
            return e.createElement(t, n)
        }

        function Rp(e, t) {
            const n = e[Jn], r = n.indexOf(t);
            Ah(t), n.splice(r, 1)
        }

        function ps(e, t) {
            if (e.length <= Ce) return;
            const n = Ce + t, r = e[n];
            if (r) {
                const o = r[po];
                null !== o && o !== e && Rp(o, r), t > 0 && (e[n - 1][pt] = r[pt]);
                const i = ns(e, Ce + t);
                !function N_(e, t) {
                    Ro(e, t, t[P], 2, null, null), t[ie] = null, t[be] = null
                }(r[C], r);
                const s = i[bt];
                null !== s && s.detachView(i[C]), r[re] = null, r[pt] = null, r[k] &= -129
            }
            return r
        }

        function oc(e, t) {
            if (!(256 & t[k])) {
                const n = t[P];
                t[mo] && ph(t[mo]), t[vo] && ph(t[vo]), n.destroyNode && Ro(e, t, n, 3, null, null), function O_(e) {
                    let t = e[ho];
                    if (!t) return ic(e[C], e);
                    for (; t;) {
                        let n = null;
                        if (He(t)) n = t[ho]; else {
                            const r = t[Ce];
                            r && (n = r)
                        }
                        if (!n) {
                            for (; t && !t[pt] && t !== e;) He(t) && ic(t[C], t), t = t[re];
                            null === t && (t = e), He(t) && ic(t[C], t), n = t && t[pt]
                        }
                        t = n
                    }
                }(t)
            }
        }

        function ic(e, t) {
            if (!(256 & t[k])) {
                t[k] &= -129, t[k] |= 256, function L_(e, t) {
                    let n;
                    if (null != e && null != (n = e.destroyHooks)) for (let r = 0; r < n.length; r += 2) {
                        const o = t[n[r]];
                        if (!(o instanceof Co)) {
                            const i = n[r + 1];
                            if (Array.isArray(i)) for (let s = 0; s < i.length; s += 2) {
                                const a = o[i[s]], u = i[s + 1];
                                St(4, a, u);
                                try {
                                    u.call(a)
                                } finally {
                                    St(5, a, u)
                                }
                            } else {
                                St(4, o, i);
                                try {
                                    i.call(o)
                                } finally {
                                    St(5, o, i)
                                }
                            }
                        }
                    }
                }(e, t), function k_(e, t) {
                    const n = e.cleanup, r = t[Zn];
                    if (null !== n) for (let i = 0; i < n.length - 1; i += 2) if ("string" == typeof n[i]) {
                        const s = n[i + 3];
                        s >= 0 ? r[s]() : r[-s].unsubscribe(), i += 2
                    } else n[i].call(r[n[i + 1]]);
                    null !== r && (t[Zn] = null);
                    const o = t[un];
                    if (null !== o) {
                        t[un] = null;
                        for (let i = 0; i < o.length; i++) (0, o[i])()
                    }
                }(e, t), 1 === t[C].type && t[P].destroy();
                const n = t[po];
                if (null !== n && Ne(t[re])) {
                    n !== t[re] && Rp(n, t);
                    const r = t[bt];
                    null !== r && r.detachView(e)
                }
                !function w_(e) {
                    Ju.delete(e[go])
                }(t)
            }
        }

        function sc(e, t, n) {
            return function xp(e, t, n) {
                let r = t;
                for (; null !== r && 40 & r.type;) r = (t = r).parent;
                if (null === r) return n[ie];
                {
                    const {componentOffset: o} = r;
                    if (o > -1) {
                        const {encapsulation: i} = e.data[r.directiveStart + o];
                        if (i === ft.None || i === ft.Emulated) return null
                    }
                    return Ve(r, n)
                }
            }(e, t.parent, n)
        }

        function Nn(e, t, n, r, o) {
            e.insertBefore(t, n, r, o)
        }

        function Op(e, t, n) {
            e.appendChild(t, n)
        }

        function Pp(e, t, n, r, o) {
            null !== r ? Nn(e, t, n, r, o) : Op(e, t, n)
        }

        function gs(e, t) {
            return e.parentNode(t)
        }

        let ac, dc, Lp = function kp(e, t, n) {
            return 40 & e.type ? Ve(e, n) : null
        };

        function ms(e, t, n, r) {
            const o = sc(e, r, t), i = t[P], a = function Fp(e, t, n) {
                return Lp(e, t, n)
            }(r.parent || t[be], r, t);
            if (null != o) if (Array.isArray(n)) for (let u = 0; u < n.length; u++) Pp(i, o, n[u], a, !1); else Pp(i, o, n, a, !1);
            void 0 !== ac && ac(i, r, t, n, o)
        }

        function No(e, t) {
            if (null !== t) {
                const n = t.type;
                if (3 & n) return Ve(t, e);
                if (4 & n) return uc(-1, e[t.index]);
                if (8 & n) {
                    const r = t.child;
                    if (null !== r) return No(e, r);
                    {
                        const o = e[t.index];
                        return Ne(o) ? uc(-1, o) : K(o)
                    }
                }
                if (32 & n) return nc(t, e)() || K(e[t.index]);
                {
                    const r = $p(e, t);
                    return null !== r ? Array.isArray(r) ? r[0] : No(Ao(e[ue]), r) : No(e, t.next)
                }
            }
            return null
        }

        function $p(e, t) {
            return null !== t ? e[ue][be].projection[t.projection] : null
        }

        function uc(e, t) {
            const n = Ce + e + 1;
            if (n < t.length) {
                const r = t[n], o = r[C].firstChild;
                if (null !== o) return No(r, o)
            }
            return t[_t]
        }

        function cc(e, t, n, r, o, i, s) {
            for (; null != n;) {
                const a = r[n.index], u = n.type;
                if (s && 0 === t && (a && _e(K(a), r), n.flags |= 2), 32 != (32 & n.flags)) if (8 & u) cc(e, t, n.child, r, o, i, !1), hr(t, e, o, a, i); else if (32 & u) {
                    const c = nc(n, r);
                    let l;
                    for (; l = c();) hr(t, e, o, l, i);
                    hr(t, e, o, a, i)
                } else 16 & u ? Vp(e, t, r, n, o, i) : hr(t, e, o, a, i);
                n = s ? n.projectionNext : n.next
            }
        }

        function Ro(e, t, n, r, o, i) {
            cc(n, r, e.firstChild, t, o, i, !1)
        }

        function Vp(e, t, n, r, o, i) {
            const s = n[ue], u = s[be].projection[r.projection];
            if (Array.isArray(u)) for (let c = 0; c < u.length; c++) hr(t, e, o, u[c], i); else {
                let c = u;
                const l = s[re];
                ls(r) && (c.flags |= 128), cc(e, t, c, l, o, i, !0)
            }
        }

        function Bp(e, t, n) {
            "" === n ? e.removeAttribute(t, "class") : e.setAttribute(t, "class", n)
        }

        function Up(e, t, n) {
            const {mergedAttrs: r, classes: o, styles: i} = n;
            null !== r && Cu(e, t, r), null !== o && Bp(e, t, o), null !== i && function U_(e, t, n) {
                e.setAttribute(t, "style", n)
            }(e, t, i)
        }

        const Fo = new b("ENVIRONMENT_INITIALIZER"), rg = new b("INJECTOR", -1), og = new b("INJECTOR_DEF_TYPES");

        class vc {
            get(t, n = ao) {
                if (n === ao) {
                    const r = new Error(`NullInjectorError: No provider for ${pe(t)}!`);
                    throw r.name = "NullInjectorError", r
                }
                return n
            }
        }

        function mS(...e) {
            return {\u0275providers: ig(0, e), \u0275fromNgModule: !0}
        }

        function ig(e, ...t) {
            const n = [], r = new Set;
            let o;
            const i = s => {
                n.push(s)
            };
            return cr(t, s => {
                const a = s;
                Cs(a, i, [], r) && (o ||= [], o.push(a))
            }), void 0 !== o && sg(o, i), n
        }

        function sg(e, t) {
            for (let n = 0; n < e.length; n++) {
                const {ngModule: r, providers: o} = e[n];
                Dc(o, i => {
                    t(i, r)
                })
            }
        }

        function Cs(e, t, n, r) {
            if (!(e = x(e))) return !1;
            let o = null, i = Pi(e);
            const s = !i && V(e);
            if (i || s) {
                if (s && !s.standalone) return !1;
                o = e
            } else {
                const u = e.ngModule;
                if (i = Pi(u), !i) return !1;
                o = u
            }
            const a = r.has(o);
            if (s) {
                if (a) return !1;
                if (r.add(o), s.dependencies) {
                    const u = "function" == typeof s.dependencies ? s.dependencies() : s.dependencies;
                    for (const c of u) Cs(c, t, n, r)
                }
            } else {
                if (!i) return !1;
                {
                    if (null != i.imports && !a) {
                        let c;
                        r.add(o);
                        try {
                            cr(i.imports, l => {
                                Cs(l, t, n, r) && (c ||= [], c.push(l))
                            })
                        } finally {
                        }
                        void 0 !== c && sg(c, t)
                    }
                    if (!a) {
                        const c = Sn(o) || (() => new o);
                        t({provide: o, useFactory: c, deps: U}, o), t({
                            provide: og,
                            useValue: o,
                            multi: !0
                        }, o), t({provide: Fo, useValue: () => _(o), multi: !0}, o)
                    }
                    const u = i.providers;
                    if (null != u && !a) {
                        const c = e;
                        Dc(u, l => {
                            t(l, c)
                        })
                    }
                }
            }
            return o !== e && void 0 !== e.providers
        }

        function Dc(e, t) {
            for (let n of e) cu(n) && (n = n.\u0275providers), Array.isArray(n) ? Dc(n, t) : t(n)
        }

        const vS = Z({provide: String, useValue: Z});

        function wc(e) {
            return null !== e && "object" == typeof e && vS in e
        }

        function Rn(e) {
            return "function" == typeof e
        }

        const Cc = new b("Set Injector scope."), Es = {}, DS = {};
        let Ec;

        function Is() {
            return void 0 === Ec && (Ec = new vc), Ec
        }

        class Qe {
        }

        class vr extends Qe {
            get destroyed() {
                return this._destroyed
            }

            constructor(t, n, r, o) {
                super(), this.parent = n, this.source = r, this.scopes = o, this.records = new Map, this._ngOnDestroyHooks = new Set, this._onDestroyHooks = [], this._destroyed = !1, bc(t, s => this.processProvider(s)), this.records.set(rg, yr(void 0, this)), o.has("environment") && this.records.set(Qe, yr(void 0, this));
                const i = this.records.get(Cc);
                null != i && "string" == typeof i.value && this.scopes.add(i.value), this.injectorDefTypes = new Set(this.get(og.multi, U, $.Self))
            }

            destroy() {
                this.assertNotDestroyed(), this._destroyed = !0;
                try {
                    for (const n of this._ngOnDestroyHooks) n.ngOnDestroy();
                    const t = this._onDestroyHooks;
                    this._onDestroyHooks = [];
                    for (const n of t) n()
                } finally {
                    this.records.clear(), this._ngOnDestroyHooks.clear(), this.injectorDefTypes.clear()
                }
            }

            onDestroy(t) {
                return this.assertNotDestroyed(), this._onDestroyHooks.push(t), () => this.removeOnDestroy(t)
            }

            runInContext(t) {
                this.assertNotDestroyed();
                const n = on(this), r = je(void 0);
                try {
                    return t()
                } finally {
                    on(n), je(r)
                }
            }

            get(t, n = ao, r = $.Default) {
                if (this.assertNotDestroyed(), t.hasOwnProperty(Gf)) return t[Gf](this);
                r = Li(r);
                const i = on(this), s = je(void 0);
                try {
                    if (!(r & $.SkipSelf)) {
                        let u = this.records.get(t);
                        if (void 0 === u) {
                            const c = function bS(e) {
                                return "function" == typeof e || "object" == typeof e && e instanceof b
                            }(t) && Oi(t);
                            u = c && this.injectableDefInScope(c) ? yr(Ic(t), Es) : null, this.records.set(t, u)
                        }
                        if (null != u) return this.hydrate(t, u)
                    }
                    return (r & $.Self ? Is() : this.parent).get(t, n = r & $.Optional && n === ao ? null : n)
                } catch (a) {
                    if ("NullInjectorError" === a.name) {
                        if ((a[ki] = a[ki] || []).unshift(pe(t)), i) throw a;
                        return function vI(e, t, n, r) {
                            const o = e[ki];
                            throw t[Bf] && o.unshift(t[Bf]), e.message = function yI(e, t, n, r = null) {
                                e = e && "\n" === e.charAt(0) && "\u0275" == e.charAt(1) ? e.slice(2) : e;
                                let o = pe(t);
                                if (Array.isArray(t)) o = t.map(pe).join(" -> "); else if ("object" == typeof t) {
                                    let i = [];
                                    for (let s in t) if (t.hasOwnProperty(s)) {
                                        let a = t[s];
                                        i.push(s + ":" + ("string" == typeof a ? JSON.stringify(a) : pe(a)))
                                    }
                                    o = `{${i.join(", ")}}`
                                }
                                return `${n}${r ? "(" + r + ")" : ""}[${o}]: ${e.replace(fI, "\n  ")}`
                            }("\n" + e.message, o, n, r), e.ngTokenPath = o, e[ki] = null, e
                        }(a, t, "R3InjectorError", this.source)
                    }
                    throw a
                } finally {
                    je(s), on(i)
                }
            }

            resolveInjectorInitializers() {
                const t = on(this), n = je(void 0);
                try {
                    const o = this.get(Fo.multi, U, $.Self);
                    for (const i of o) i()
                } finally {
                    on(t), je(n)
                }
            }

            toString() {
                const t = [], n = this.records;
                for (const r of n.keys()) t.push(pe(r));
                return `R3Injector[${t.join(", ")}]`
            }

            assertNotDestroyed() {
                if (this._destroyed) throw new w(205, !1)
            }

            processProvider(t) {
                let n = Rn(t = x(t)) ? t : x(t && t.provide);
                const r = function CS(e) {
                    return wc(e) ? yr(void 0, e.useValue) : yr(function cg(e, t, n) {
                        let r;
                        if (Rn(e)) {
                            const o = x(e);
                            return Sn(o) || Ic(o)
                        }
                        if (wc(e)) r = () => x(e.useValue); else if (function ug(e) {
                            return !(!e || !e.useFactory)
                        }(e)) r = () => e.useFactory(...yu(e.deps || [])); else if (function ag(e) {
                            return !(!e || !e.useExisting)
                        }(e)) r = () => _(x(e.useExisting)); else {
                            const o = x(e && (e.useClass || e.provide));
                            if (!function ES(e) {
                                return !!e.deps
                            }(e)) return Sn(o) || Ic(o);
                            r = () => new o(...yu(e.deps))
                        }
                        return r
                    }(e), Es)
                }(t);
                if (Rn(t) || !0 !== t.multi) this.records.get(n); else {
                    let o = this.records.get(n);
                    o || (o = yr(void 0, Es, !0), o.factory = () => yu(o.multi), this.records.set(n, o)), n = t, o.multi.push(t)
                }
                this.records.set(n, r)
            }

            hydrate(t, n) {
                return n.value === Es && (n.value = DS, n.value = n.factory()), "object" == typeof n.value && n.value && function IS(e) {
                    return null !== e && "object" == typeof e && "function" == typeof e.ngOnDestroy
                }(n.value) && this._ngOnDestroyHooks.add(n.value), n.value
            }

            injectableDefInScope(t) {
                if (!t.providedIn) return !1;
                const n = x(t.providedIn);
                return "string" == typeof n ? "any" === n || this.scopes.has(n) : this.injectorDefTypes.has(n)
            }

            removeOnDestroy(t) {
                const n = this._onDestroyHooks.indexOf(t);
                -1 !== n && this._onDestroyHooks.splice(n, 1)
            }
        }

        function Ic(e) {
            const t = Oi(e), n = null !== t ? t.factory : Sn(e);
            if (null !== n) return n;
            if (e instanceof b) throw new w(204, !1);
            if (e instanceof Function) return function wS(e) {
                const t = e.length;
                if (t > 0) throw function So(e, t) {
                    const n = [];
                    for (let r = 0; r < e; r++) n.push(t);
                    return n
                }(t, "?"), new w(204, !1);
                const n = function uI(e) {
                    return e && (e[Fi] || e[jf]) || null
                }(e);
                return null !== n ? () => n.factory(e) : () => new e
            }(e);
            throw new w(204, !1)
        }

        function yr(e, t, n = !1) {
            return {factory: e, value: t, multi: n ? [] : void 0}
        }

        function bc(e, t) {
            for (const n of e) Array.isArray(n) ? bc(n, t) : n && cu(n) ? bc(n.\u0275providers, t) : t(n)
        }

        const bs = new b("AppId", {providedIn: "root", factory: () => _S}), _S = "ng",
            lg = new b("Platform Initializer"),
            xn = new b("Platform ID", {providedIn: "platform", factory: () => "unknown"}), dg = new b("CSP nonce", {
                providedIn: "root", factory: () => function gr() {
                    if (void 0 !== dc) return dc;
                    if (typeof document < "u") return document;
                    throw new w(210, !1)
                }().body?.querySelector("[ngCspNonce]")?.getAttribute("ngCspNonce") || null
            });
        let fg = (e, t, n) => null;

        function xc(e, t, n = !1) {
            return fg(e, t, n)
        }

        class FS {
        }

        class gg {
        }

        class LS {
            resolveComponentFactory(t) {
                throw function kS(e) {
                    const t = Error(`No component factory found for ${pe(e)}.`);
                    return t.ngComponent = e, t
                }(t)
            }
        }

        let Ns = (() => {
            class e {
                static {
                    this.NULL = new LS
                }
            }

            return e
        })();

        function jS() {
            return Cr(Ie(), y())
        }

        function Cr(e, t) {
            return new pn(Ve(e, t))
        }

        let pn = (() => {
            class e {
                constructor(n) {
                    this.nativeElement = n
                }

                static {
                    this.__NG_ELEMENT_ID__ = jS
                }
            }

            return e
        })();

        class vg {
        }

        let VS = (() => {
            class e {
                static {
                    this.\u0275prov = S({token: e, providedIn: "root", factory: () => null})
                }
            }

            return e
        })();

        class xs {
            constructor(t) {
                this.full = t, this.major = t.split(".")[0], this.minor = t.split(".")[1], this.patch = t.split(".").slice(2).join(".")
            }
        }

        const BS = new xs("16.2.12"), Fc = {};

        function Cg(e, t = null, n = null, r) {
            const o = Eg(e, t, n, r);
            return o.resolveInjectorInitializers(), o
        }

        function Eg(e, t = null, n = null, r, o = new Set) {
            const i = [n || U, mS(e)];
            return r = r || ("object" == typeof e ? void 0 : pe(e)), new vr(i, t || Is(), r || null, o)
        }

        let it = (() => {
            class e {
                static {
                    this.THROW_IF_NOT_FOUND = ao
                }
                static {
                    this.NULL = new vc
                }

                static create(n, r) {
                    if (Array.isArray(n)) return Cg({name: ""}, r, n, "");
                    {
                        const o = n.name ?? "";
                        return Cg({name: o}, n.parent, n.providers, o)
                    }
                }

                static {
                    this.\u0275prov = S({token: e, providedIn: "any", factory: () => _(rg)})
                }
                static {
                    this.__NG_ELEMENT_ID__ = -1
                }
            }

            return e
        })();

        function Lc(e) {
            return e.ngOriginalError
        }

        class Gt {
            constructor() {
                this._console = console
            }

            handleError(t) {
                const n = this._findOriginalError(t);
                this._console.error("ERROR", t), n && this._console.error("ORIGINAL ERROR", n)
            }

            _findOriginalError(t) {
                let n = t && Lc(t);
                for (; n && Lc(n);) n = Lc(n);
                return n || null
            }
        }

        function jc(e) {
            return t => {
                setTimeout(e, void 0, t)
            }
        }

        const Pe = class QS extends lt {
            constructor(t = !1) {
                super(), this.__isAsync = t
            }

            emit(t) {
                super.next(t)
            }

            subscribe(t, n, r) {
                let o = t, i = n || (() => null), s = r;
                if (t && "object" == typeof t) {
                    const u = t;
                    o = u.next?.bind(u), i = u.error?.bind(u), s = u.complete?.bind(u)
                }
                this.__isAsync && (i = jc(i), o && (o = jc(o)), s && (s = jc(s)));
                const a = super.subscribe({next: o, error: i, complete: s});
                return t instanceof Ge && t.add(a), a
            }
        };

        function bg(...e) {
        }

        class ee {
            constructor({
                            enableLongStackTrace: t = !1,
                            shouldCoalesceEventChangeDetection: n = !1,
                            shouldCoalesceRunChangeDetection: r = !1
                        }) {
                if (this.hasPendingMacrotasks = !1, this.hasPendingMicrotasks = !1, this.isStable = !0, this.onUnstable = new Pe(!1), this.onMicrotaskEmpty = new Pe(!1), this.onStable = new Pe(!1), this.onError = new Pe(!1), typeof Zone > "u") throw new w(908, !1);
                Zone.assertZonePatched();
                const o = this;
                o._nesting = 0, o._outer = o._inner = Zone.current, Zone.TaskTrackingZoneSpec && (o._inner = o._inner.fork(new Zone.TaskTrackingZoneSpec)), t && Zone.longStackTraceZoneSpec && (o._inner = o._inner.fork(Zone.longStackTraceZoneSpec)), o.shouldCoalesceEventChangeDetection = !r && n, o.shouldCoalesceRunChangeDetection = r, o.lastRequestAnimationFrameId = -1, o.nativeRequestAnimationFrame = function XS() {
                    const e = "function" == typeof J.requestAnimationFrame;
                    let t = J[e ? "requestAnimationFrame" : "setTimeout"],
                        n = J[e ? "cancelAnimationFrame" : "clearTimeout"];
                    if (typeof Zone < "u" && t && n) {
                        const r = t[Zone.__symbol__("OriginalDelegate")];
                        r && (t = r);
                        const o = n[Zone.__symbol__("OriginalDelegate")];
                        o && (n = o)
                    }
                    return {nativeRequestAnimationFrame: t, nativeCancelAnimationFrame: n}
                }().nativeRequestAnimationFrame, function eM(e) {
                    const t = () => {
                        !function KS(e) {
                            e.isCheckStableRunning || -1 !== e.lastRequestAnimationFrameId || (e.lastRequestAnimationFrameId = e.nativeRequestAnimationFrame.call(J, () => {
                                e.fakeTopEventTask || (e.fakeTopEventTask = Zone.root.scheduleEventTask("fakeTopEventTask", () => {
                                    e.lastRequestAnimationFrameId = -1, Hc(e), e.isCheckStableRunning = !0, $c(e), e.isCheckStableRunning = !1
                                }, void 0, () => {
                                }, () => {
                                })), e.fakeTopEventTask.invoke()
                            }), Hc(e))
                        }(e)
                    };
                    e._inner = e._inner.fork({
                        name: "angular",
                        properties: {isAngularZone: !0},
                        onInvokeTask: (n, r, o, i, s, a) => {
                            if (function nM(e) {
                                return !(!Array.isArray(e) || 1 !== e.length) && !0 === e[0].data?.__ignore_ng_zone__
                            }(a)) return n.invokeTask(o, i, s, a);
                            try {
                                return _g(e), n.invokeTask(o, i, s, a)
                            } finally {
                                (e.shouldCoalesceEventChangeDetection && "eventTask" === i.type || e.shouldCoalesceRunChangeDetection) && t(), Sg(e)
                            }
                        },
                        onInvoke: (n, r, o, i, s, a, u) => {
                            try {
                                return _g(e), n.invoke(o, i, s, a, u)
                            } finally {
                                e.shouldCoalesceRunChangeDetection && t(), Sg(e)
                            }
                        },
                        onHasTask: (n, r, o, i) => {
                            n.hasTask(o, i), r === o && ("microTask" == i.change ? (e._hasPendingMicrotasks = i.microTask, Hc(e), $c(e)) : "macroTask" == i.change && (e.hasPendingMacrotasks = i.macroTask))
                        },
                        onHandleError: (n, r, o, i) => (n.handleError(o, i), e.runOutsideAngular(() => e.onError.emit(i)), !1)
                    })
                }(o)
            }

            static isInAngularZone() {
                return typeof Zone < "u" && !0 === Zone.current.get("isAngularZone")
            }

            static assertInAngularZone() {
                if (!ee.isInAngularZone()) throw new w(909, !1)
            }

            static assertNotInAngularZone() {
                if (ee.isInAngularZone()) throw new w(909, !1)
            }

            run(t, n, r) {
                return this._inner.run(t, n, r)
            }

            runTask(t, n, r, o) {
                const i = this._inner, s = i.scheduleEventTask("NgZoneEvent: " + o, t, JS, bg, bg);
                try {
                    return i.runTask(s, n, r)
                } finally {
                    i.cancelTask(s)
                }
            }

            runGuarded(t, n, r) {
                return this._inner.runGuarded(t, n, r)
            }

            runOutsideAngular(t) {
                return this._outer.run(t)
            }
        }

        const JS = {};

        function $c(e) {
            if (0 == e._nesting && !e.hasPendingMicrotasks && !e.isStable) try {
                e._nesting++, e.onMicrotaskEmpty.emit(null)
            } finally {
                if (e._nesting--, !e.hasPendingMicrotasks) try {
                    e.runOutsideAngular(() => e.onStable.emit(null))
                } finally {
                    e.isStable = !0
                }
            }
        }

        function Hc(e) {
            e.hasPendingMicrotasks = !!(e._hasPendingMicrotasks || (e.shouldCoalesceEventChangeDetection || e.shouldCoalesceRunChangeDetection) && -1 !== e.lastRequestAnimationFrameId)
        }

        function _g(e) {
            e._nesting++, e.isStable && (e.isStable = !1, e.onUnstable.emit(null))
        }

        function Sg(e) {
            e._nesting--, $c(e)
        }

        class tM {
            constructor() {
                this.hasPendingMicrotasks = !1, this.hasPendingMacrotasks = !1, this.isStable = !0, this.onUnstable = new Pe, this.onMicrotaskEmpty = new Pe, this.onStable = new Pe, this.onError = new Pe
            }

            run(t, n, r) {
                return t.apply(n, r)
            }

            runGuarded(t, n, r) {
                return t.apply(n, r)
            }

            runOutsideAngular(t) {
                return t()
            }

            runTask(t, n, r, o) {
                return t.apply(n, r)
            }
        }

        const Mg = new b("", {providedIn: "root", factory: Tg});

        function Tg() {
            const e = I(ee);
            let t = !0;
            return function JE(...e) {
                const t = so(e), n = function GE(e, t) {
                    return "number" == typeof ou(e) ? e.pop() : t
                }(e, 1 / 0), r = e;
                return r.length ? 1 === r.length ? et(r[0]) : Gn(n)(ve(r, t)) : Et
            }(new le(o => {
                t = e.isStable && !e.hasPendingMacrotasks && !e.hasPendingMicrotasks, e.runOutsideAngular(() => {
                    o.next(t), o.complete()
                })
            }), new le(o => {
                let i;
                e.runOutsideAngular(() => {
                    i = e.onStable.subscribe(() => {
                        ee.assertNotInAngularZone(), queueMicrotask(() => {
                            !t && !e.hasPendingMacrotasks && !e.hasPendingMicrotasks && (t = !0, o.next(!0))
                        })
                    })
                });
                const s = e.onUnstable.subscribe(() => {
                    ee.assertInAngularZone(), t && (t = !1, e.runOutsideAngular(() => {
                        o.next(!1)
                    }))
                });
                return () => {
                    i.unsubscribe(), s.unsubscribe()
                }
            }).pipe(Ff()))
        }

        function qt(e) {
            return e instanceof Function ? e() : e
        }

        let Vc = (() => {
            class e {
                constructor() {
                    this.renderDepth = 0, this.handler = null
                }

                begin() {
                    this.handler?.validateBegin(), this.renderDepth++
                }

                end() {
                    this.renderDepth--, 0 === this.renderDepth && this.handler?.execute()
                }

                ngOnDestroy() {
                    this.handler?.destroy(), this.handler = null
                }

                static {
                    this.\u0275prov = S({token: e, providedIn: "root", factory: () => new e})
                }
            }

            return e
        })();

        function jo(e) {
            for (; e;) {
                e[k] |= 64;
                const t = Ao(e);
                if (bu(e) && !t) return e;
                e = t
            }
            return null
        }

        const Og = new b("", {providedIn: "root", factory: () => !1});
        let Fs = null;

        function Lg(e, t) {
            return e[t] ?? Hg()
        }

        function jg(e, t) {
            const n = Hg();
            n.producerNode?.length && (e[t] = Fs, n.lView = e, Fs = $g())
        }

        const fM = {
            ...uh, consumerIsAlwaysLive: !0, consumerMarkedDirty: e => {
                jo(e.lView)
            }, lView: null
        };

        function $g() {
            return Object.create(fM)
        }

        function Hg() {
            return Fs ??= $g(), Fs
        }

        const F = {};

        function Bc(e) {
            Vg(B(), y(), xe() + e, !1)
        }

        function Vg(e, t, n, r) {
            if (!r) if (3 == (3 & t[k])) {
                const i = e.preOrderCheckHooks;
                null !== i && Yi(t, i, n)
            } else {
                const i = e.preOrderHooks;
                null !== i && Qi(t, i, 0, n)
            }
            Tn(n)
        }

        function T(e, t = $.Default) {
            const n = y();
            return null === n ? _(e, t) : Kh(Ie(), n, x(e), t)
        }

        function ks(e, t, n, r, o, i, s, a, u, c, l) {
            const d = t.blueprint.slice();
            return d[ie] = o, d[k] = 140 | r, (null !== c || e && 2048 & e[k]) && (d[k] |= 2048), Th(d), d[re] = d[Qn] = e, d[ae] = n, d[Yn] = s || e && e[Yn], d[P] = a || e && e[P], d[an] = u || e && e[an] || null, d[be] = i, d[go] = function y_() {
                return v_++
            }(), d[Vt] = l, d[oh] = c, d[ue] = 2 == t.type ? e[ue] : d, d
        }

        function br(e, t, n, r, o) {
            let i = e.data[t];
            if (null === i) i = function Uc(e, t, n, r, o) {
                const i = Ph(), s = xu(), u = e.data[t] = function wM(e, t, n, r, o, i) {
                    let s = t ? t.injectorIndex : -1, a = 0;
                    return function tr() {
                        return null !== R.skipHydrationRootTNode
                    }() && (a |= 128), {
                        type: n,
                        index: r,
                        insertBeforeIndex: null,
                        injectorIndex: s,
                        directiveStart: -1,
                        directiveEnd: -1,
                        directiveStylingLast: -1,
                        componentOffset: -1,
                        propertyBindings: null,
                        flags: a,
                        providerIndexes: 0,
                        value: o,
                        attrs: i,
                        mergedAttrs: null,
                        localNames: null,
                        initialInputs: void 0,
                        inputs: null,
                        outputs: null,
                        tView: null,
                        next: null,
                        prev: null,
                        projectionNext: null,
                        child: null,
                        parent: t,
                        projection: null,
                        styles: null,
                        stylesWithoutHost: null,
                        residualStyles: void 0,
                        classes: null,
                        classesWithoutHost: null,
                        residualClasses: void 0,
                        classBindings: 0,
                        styleBindings: 0
                    }
                }(0, s ? i : i && i.parent, n, t, r, o);
                return null === e.firstChild && (e.firstChild = u), null !== i && (s ? null == i.child && null !== u.parent && (i.child = u) : null === i.next && (i.next = u, u.prev = i)), u
            }(e, t, n, r, o), function vb() {
                return R.lFrame.inI18n
            }() && (i.flags |= 32); else if (64 & i.type) {
                i.type = n, i.value = r, i.attrs = o;
                const s = function wo() {
                    const e = R.lFrame, t = e.currentTNode;
                    return e.isParent ? t : t.parent
                }();
                i.injectorIndex = null === s ? -1 : s.injectorIndex
            }
            return Mt(i, !0), i
        }

        function $o(e, t, n, r) {
            if (0 === n) return -1;
            const o = t.length;
            for (let i = 0; i < n; i++) t.push(r), e.blueprint.push(r), e.data.push(null);
            return o
        }

        function Ug(e, t, n, r, o) {
            const i = Lg(t, mo), s = xe(), a = 2 & r;
            try {
                Tn(-1), a && t.length > H && Vg(e, t, H, !1), St(a ? 2 : 0, o);
                const c = a ? i : null, l = Su(c);
                try {
                    null !== c && (c.dirty = !1), n(r, o)
                } finally {
                    Mu(c, l)
                }
            } finally {
                a && null === t[mo] && jg(t, mo), Tn(s), St(a ? 3 : 1, o)
            }
        }

        function zc(e, t, n) {
            if (Iu(t)) {
                const r = rt(null);
                try {
                    const i = t.directiveEnd;
                    for (let s = t.directiveStart; s < i; s++) {
                        const a = e.data[s];
                        a.contentQueries && a.contentQueries(1, n[s], s)
                    }
                } finally {
                    rt(r)
                }
            }
        }

        function Gc(e, t, n) {
            Oh() && (function MM(e, t, n, r) {
                const o = n.directiveStart, i = n.directiveEnd;
                _n(n) && function PM(e, t, n) {
                    const r = Ve(t, e), o = zg(n);
                    let s = 16;
                    n.signals ? s = 4096 : n.onPush && (s = 64);
                    const a = Ls(e, ks(e, o, null, s, r, t, null, e[Yn].rendererFactory.createRenderer(r, n), null, null, null));
                    e[t.index] = a
                }(t, n, e.data[o + n.componentOffset]), e.firstCreatePass || Ji(n, t), _e(r, t);
                const s = n.initialInputs;
                for (let a = o; a < i; a++) {
                    const u = e.data[a], c = An(t, e, a, n);
                    _e(c, t), null !== s && FM(0, a - o, c, u, 0, s), gt(u) && (Ze(n.index, t)[ae] = An(t, e, a, n))
                }
            }(e, t, n, Ve(n, t)), 64 == (64 & n.flags) && Yg(e, t, n))
        }

        function qc(e, t, n = Ve) {
            const r = t.localNames;
            if (null !== r) {
                let o = t.index + 1;
                for (let i = 0; i < r.length; i += 2) {
                    const s = r[i + 1], a = -1 === s ? n(t, e) : e[s];
                    e[o++] = a
                }
            }
        }

        function zg(e) {
            const t = e.tView;
            return null === t || t.incompleteFirstPass ? e.tView = Wc(1, null, e.template, e.decls, e.vars, e.directiveDefs, e.pipeDefs, e.viewQuery, e.schemas, e.consts, e.id) : t
        }

        function Wc(e, t, n, r, o, i, s, a, u, c, l) {
            const d = H + r, f = d + o, h = function pM(e, t) {
                const n = [];
                for (let r = 0; r < t; r++) n.push(r < e ? null : F);
                return n
            }(d, f), p = "function" == typeof c ? c() : c;
            return h[C] = {
                type: e,
                blueprint: h,
                template: n,
                queries: null,
                viewQuery: a,
                declTNode: t,
                data: h.slice().fill(null, d),
                bindingStartIndex: d,
                expandoStartIndex: f,
                hostBindingOpCodes: null,
                firstCreatePass: !0,
                firstUpdatePass: !0,
                staticViewQueries: !1,
                staticContentQueries: !1,
                preOrderHooks: null,
                preOrderCheckHooks: null,
                contentHooks: null,
                contentCheckHooks: null,
                viewHooks: null,
                viewCheckHooks: null,
                destroyHooks: null,
                cleanup: null,
                contentQueries: null,
                components: null,
                directiveRegistry: "function" == typeof i ? i() : i,
                pipeRegistry: "function" == typeof s ? s() : s,
                firstChild: null,
                schemas: u,
                consts: p,
                incompleteFirstPass: !1,
                ssrId: l
            }
        }

        let Gg = e => null;

        function qg(e, t, n, r) {
            for (let o in e) if (e.hasOwnProperty(o)) {
                n = null === n ? {} : n;
                const i = e[o];
                null === r ? Wg(n, t, o, i) : r.hasOwnProperty(o) && Wg(n, t, r[o], i)
            }
            return n
        }

        function Wg(e, t, n, r) {
            e.hasOwnProperty(n) ? e[n].push(t, r) : e[n] = [t, r]
        }

        function Zc(e, t, n, r) {
            if (Oh()) {
                const o = null === r ? null : {"": -1}, i = function AM(e, t) {
                    const n = e.directiveRegistry;
                    let r = null, o = null;
                    if (n) for (let i = 0; i < n.length; i++) {
                        const s = n[i];
                        if (Jf(t, s.selectors, !1)) if (r || (r = []), gt(s)) if (null !== s.findHostDirectiveDefs) {
                            const a = [];
                            o = o || new Map, s.findHostDirectiveDefs(s, a, o), r.unshift(...a, s), Yc(e, t, a.length)
                        } else r.unshift(s), Yc(e, t, 0); else o = o || new Map, s.findHostDirectiveDefs?.(s, r, o), r.push(s)
                    }
                    return null === r ? null : [r, o]
                }(e, n);
                let s, a;
                null === i ? s = a = null : [s, a] = i, null !== s && Zg(e, t, n, s, o, a), o && function NM(e, t, n) {
                    if (t) {
                        const r = e.localNames = [];
                        for (let o = 0; o < t.length; o += 2) {
                            const i = n[t[o + 1]];
                            if (null == i) throw new w(-301, !1);
                            r.push(t[o], i)
                        }
                    }
                }(n, r, o)
            }
            n.mergedAttrs = lo(n.mergedAttrs, n.attrs)
        }

        function Zg(e, t, n, r, o, i) {
            for (let c = 0; c < r.length; c++) zu(Ji(n, t), e, r[c].type);
            !function xM(e, t, n) {
                e.flags |= 1, e.directiveStart = t, e.directiveEnd = t + n, e.providerIndexes = t
            }(n, e.data.length, r.length);
            for (let c = 0; c < r.length; c++) {
                const l = r[c];
                l.providersResolver && l.providersResolver(l)
            }
            let s = !1, a = !1, u = $o(e, t, r.length, null);
            for (let c = 0; c < r.length; c++) {
                const l = r[c];
                n.mergedAttrs = lo(n.mergedAttrs, l.hostAttrs), OM(e, n, t, u, l), RM(u, l, o), null !== l.contentQueries && (n.flags |= 4), (null !== l.hostBindings || null !== l.hostAttrs || 0 !== l.hostVars) && (n.flags |= 64);
                const d = l.type.prototype;
                !s && (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) && ((e.preOrderHooks ??= []).push(n.index), s = !0), !a && (d.ngOnChanges || d.ngDoCheck) && ((e.preOrderCheckHooks ??= []).push(n.index), a = !0), u++
            }
            !function CM(e, t, n) {
                const o = t.directiveEnd, i = e.data, s = t.attrs, a = [];
                let u = null, c = null;
                for (let l = t.directiveStart; l < o; l++) {
                    const d = i[l], f = n ? n.get(d) : null, p = f ? f.outputs : null;
                    u = qg(d.inputs, l, u, f ? f.inputs : null), c = qg(d.outputs, l, c, p);
                    const g = null === u || null === s || Xf(t) ? null : kM(u, l, s);
                    a.push(g)
                }
                null !== u && (u.hasOwnProperty("class") && (t.flags |= 8), u.hasOwnProperty("style") && (t.flags |= 16)), t.initialInputs = a, t.inputs = u, t.outputs = c
            }(e, n, i)
        }

        function Yg(e, t, n) {
            const r = n.directiveStart, o = n.directiveEnd, i = n.index, s = function Db() {
                return R.lFrame.currentDirectiveIndex
            }();
            try {
                Tn(i);
                for (let a = r; a < o; a++) {
                    const u = e.data[a], c = t[a];
                    Pu(a), (null !== u.hostBindings || 0 !== u.hostVars || null !== u.hostAttrs) && TM(u, c)
                }
            } finally {
                Tn(-1), Pu(s)
            }
        }

        function TM(e, t) {
            null !== e.hostBindings && e.hostBindings(1, t)
        }

        function Yc(e, t, n) {
            t.componentOffset = n, (e.components ??= []).push(t.index)
        }

        function RM(e, t, n) {
            if (n) {
                if (t.exportAs) for (let r = 0; r < t.exportAs.length; r++) n[t.exportAs[r]] = e;
                gt(t) && (n[""] = e)
            }
        }

        function OM(e, t, n, r, o) {
            e.data[r] = o;
            const i = o.factory || (o.factory = Sn(o.type)), s = new Co(i, gt(o), T);
            e.blueprint[r] = s, n[r] = s, function _M(e, t, n, r, o) {
                const i = o.hostBindings;
                if (i) {
                    let s = e.hostBindingOpCodes;
                    null === s && (s = e.hostBindingOpCodes = []);
                    const a = ~t.index;
                    (function SM(e) {
                        let t = e.length;
                        for (; t > 0;) {
                            const n = e[--t];
                            if ("number" == typeof n && n < 0) return n
                        }
                        return 0
                    })(s) != a && s.push(a), s.push(n, r, i)
                }
            }(e, t, r, $o(e, n, o.hostVars, F), o)
        }

        function FM(e, t, n, r, o, i) {
            const s = i[t];
            if (null !== s) for (let a = 0; a < s.length;) Qg(r, n, s[a++], s[a++], s[a++])
        }

        function Qg(e, t, n, r, o) {
            const i = rt(null);
            try {
                const s = e.inputTransforms;
                null !== s && s.hasOwnProperty(r) && (o = s[r].call(t, o)), null !== e.setInput ? e.setInput(t, o, n, r) : t[r] = o
            } finally {
                rt(i)
            }
        }

        function kM(e, t, n) {
            let r = null, o = 0;
            for (; o < n.length;) {
                const i = n[o];
                if (0 !== i) if (5 !== i) {
                    if ("number" == typeof i) break;
                    if (e.hasOwnProperty(i)) {
                        null === r && (r = []);
                        const s = e[i];
                        for (let a = 0; a < s.length; a += 2) if (s[a] === t) {
                            r.push(i, s[a + 1], n[o + 1]);
                            break
                        }
                    }
                    o += 2
                } else o += 2; else o += 4
            }
            return r
        }

        function Xg(e, t, n, r) {
            return [e, !0, !1, t, null, 0, r, n, null, null, null]
        }

        function Jg(e, t) {
            const n = e.contentQueries;
            if (null !== n) for (let r = 0; r < n.length; r += 2) {
                const i = n[r + 1];
                if (-1 !== i) {
                    const s = e.data[i];
                    ku(n[r]), s.contentQueries(2, t[i], i)
                }
            }
        }

        function Ls(e, t) {
            return e[ho] ? e[rh][pt] = t : e[ho] = t, e[rh] = t, t
        }

        function Xc(e, t, n) {
            ku(0);
            const r = rt(null);
            try {
                t(e, n)
            } finally {
                rt(r)
            }
        }

        function Jc(e, t, n, r, o) {
            for (let i = 0; i < n.length;) {
                const s = n[i++], a = n[i++];
                Qg(e.data[s], t[s], r, a, o)
            }
        }

        function Wt(e, t, n) {
            const r = function qi(e, t) {
                return K(t[e])
            }(t, e);
            !function Np(e, t, n) {
                e.setValue(t, n)
            }(e[P], r, n)
        }

        function LM(e, t) {
            const n = Ze(t, e), r = n[C];
            !function jM(e, t) {
                for (let n = t.length; n < e.blueprint.length; n++) t.push(e.blueprint[n])
            }(r, n);
            const o = n[ie];
            null !== o && null === n[Vt] && (n[Vt] = xc(o, n[an])), Kc(r, n, n[ae])
        }

        function Kc(e, t, n) {
            Lu(t);
            try {
                const r = e.viewQuery;
                null !== r && Xc(1, r, n);
                const o = e.template;
                null !== o && Ug(e, t, o, 1, n), e.firstCreatePass && (e.firstCreatePass = !1), e.staticContentQueries && Jg(e, t), e.staticViewQueries && Xc(2, e.viewQuery, n);
                const i = e.components;
                null !== i && function $M(e, t) {
                    for (let n = 0; n < t.length; n++) LM(e, t[n])
                }(t, i)
            } catch (r) {
                throw e.firstCreatePass && (e.incompleteFirstPass = !0, e.firstCreatePass = !1), r
            } finally {
                t[k] &= -5, ju()
            }
        }

        let rm = (() => {
            class e {
                constructor() {
                    this.all = new Set, this.queue = new Map
                }

                create(n, r, o) {
                    const i = typeof Zone > "u" ? null : Zone.current, s = function WI(e, t, n) {
                        const r = Object.create(ZI);
                        n && (r.consumerAllowSignalWrites = !0), r.fn = e, r.schedule = t;
                        const o = s => {
                            r.cleanupFn = s
                        };
                        return r.ref = {
                            notify: () => fh(r), run: () => {
                                if (r.dirty = !1, r.hasRun && !hh(r)) return;
                                r.hasRun = !0;
                                const s = Su(r);
                                try {
                                    r.cleanupFn(), r.cleanupFn = Ch, r.fn(o)
                                } finally {
                                    Mu(r, s)
                                }
                            }, cleanup: () => r.cleanupFn()
                        }, r.ref
                    }(n, c => {
                        this.all.has(c) && this.queue.set(c, i)
                    }, o);
                    let a;
                    this.all.add(s), s.notify();
                    const u = () => {
                        s.cleanup(), a?.(), this.all.delete(s), this.queue.delete(s)
                    };
                    return a = r?.onDestroy(u), {destroy: u}
                }

                flush() {
                    if (0 !== this.queue.size) for (const [n, r] of this.queue) this.queue.delete(n), r ? r.run(() => n.run()) : n.run()
                }

                get isQueueEmpty() {
                    return 0 === this.queue.size
                }

                static {
                    this.\u0275prov = S({token: e, providedIn: "root", factory: () => new e})
                }
            }

            return e
        })();

        function js(e, t, n) {
            let r = n ? e.styles : null, o = n ? e.classes : null, i = 0;
            if (null !== t) for (let s = 0; s < t.length; s++) {
                const a = t[s];
                "number" == typeof a ? i = a : 1 == i ? o = su(o, a) : 2 == i && (r = su(r, a + ": " + t[++s] + ";"))
            }
            n ? e.styles = r : e.stylesWithoutHost = r, n ? e.classes = o : e.classesWithoutHost = o
        }

        function Ho(e, t, n, r, o = !1) {
            for (; null !== n;) {
                const i = t[n.index];
                null !== i && r.push(K(i)), Ne(i) && om(i, r);
                const s = n.type;
                if (8 & s) Ho(e, t, n.child, r); else if (32 & s) {
                    const a = nc(n, t);
                    let u;
                    for (; u = a();) r.push(u)
                } else if (16 & s) {
                    const a = $p(t, n);
                    if (Array.isArray(a)) r.push(...a); else {
                        const u = Ao(t[ue]);
                        Ho(u[C], u, a, r, !0)
                    }
                }
                n = o ? n.projectionNext : n.next
            }
            return r
        }

        function om(e, t) {
            for (let n = Ce; n < e.length; n++) {
                const r = e[n], o = r[C].firstChild;
                null !== o && Ho(r[C], r, o, t)
            }
            e[_t] !== e[ie] && t.push(e[_t])
        }

        function $s(e, t, n, r = !0) {
            const o = t[Yn], i = o.rendererFactory, s = o.afterRenderEventManager;
            i.begin?.(), s?.begin();
            try {
                im(e, t, e.template, n)
            } catch (u) {
                throw r && function nm(e, t) {
                    const n = e[an], r = n ? n.get(Gt, null) : null;
                    r && r.handleError(t)
                }(t, u), u
            } finally {
                i.end?.(), o.effectManager?.flush(), s?.end()
            }
        }

        function im(e, t, n, r) {
            const o = t[k];
            if (256 != (256 & o)) {
                t[Yn].effectManager?.flush(), Lu(t);
                try {
                    Th(t), function kh(e) {
                        return R.lFrame.bindingIndex = e
                    }(e.bindingStartIndex), null !== n && Ug(e, t, n, 2, r);
                    const s = 3 == (3 & o);
                    if (s) {
                        const c = e.preOrderCheckHooks;
                        null !== c && Yi(t, c, null)
                    } else {
                        const c = e.preOrderHooks;
                        null !== c && Qi(t, c, 0, null), $u(t, 0)
                    }
                    if (function BM(e) {
                        for (let t = Mp(e); null !== t; t = Tp(t)) {
                            if (!t[ih]) continue;
                            const n = t[Jn];
                            for (let r = 0; r < n.length; r++) {
                                ob(n[r])
                            }
                        }
                    }(t), sm(t, 2), null !== e.contentQueries && Jg(e, t), s) {
                        const c = e.contentCheckHooks;
                        null !== c && Yi(t, c)
                    } else {
                        const c = e.contentHooks;
                        null !== c && Qi(t, c, 1), $u(t, 1)
                    }
                    !function hM(e, t) {
                        const n = e.hostBindingOpCodes;
                        if (null === n) return;
                        const r = Lg(t, vo);
                        try {
                            for (let o = 0; o < n.length; o++) {
                                const i = n[o];
                                if (i < 0) Tn(~i); else {
                                    const s = i, a = n[++o], u = n[++o];
                                    yb(a, s), r.dirty = !1;
                                    const c = Su(r);
                                    try {
                                        u(2, t[s])
                                    } finally {
                                        Mu(r, c)
                                    }
                                }
                            }
                        } finally {
                            null === t[vo] && jg(t, vo), Tn(-1)
                        }
                    }(e, t);
                    const a = e.components;
                    null !== a && um(t, a, 0);
                    const u = e.viewQuery;
                    if (null !== u && Xc(2, u, r), s) {
                        const c = e.viewCheckHooks;
                        null !== c && Yi(t, c)
                    } else {
                        const c = e.viewHooks;
                        null !== c && Qi(t, c, 2), $u(t, 2)
                    }
                    !0 === e.firstUpdatePass && (e.firstUpdatePass = !1), t[k] &= -73, Ah(t)
                } finally {
                    ju()
                }
            }
        }

        function sm(e, t) {
            for (let n = Mp(e); null !== n; n = Tp(n)) for (let r = Ce; r < n.length; r++) am(n[r], t)
        }

        function UM(e, t, n) {
            am(Ze(t, e), n)
        }

        function am(e, t) {
            if (!function nb(e) {
                return 128 == (128 & e[k])
            }(e)) return;
            const n = e[C], r = e[k];
            if (80 & r && 0 === t || 1024 & r || 2 === t) im(n, e, n.template, e[ae]); else if (e[fo] > 0) {
                sm(e, 1);
                const o = n.components;
                null !== o && um(e, o, 1)
            }
        }

        function um(e, t, n) {
            for (let r = 0; r < t.length; r++) UM(e, t[r], n)
        }

        class Vo {
            get rootNodes() {
                const t = this._lView, n = t[C];
                return Ho(n, t, n.firstChild, [])
            }

            constructor(t, n) {
                this._lView = t, this._cdRefInjectingView = n, this._appRef = null, this._attachedToViewContainer = !1
            }

            get context() {
                return this._lView[ae]
            }

            set context(t) {
                this._lView[ae] = t
            }

            get destroyed() {
                return 256 == (256 & this._lView[k])
            }

            destroy() {
                if (this._appRef) this._appRef.detachView(this); else if (this._attachedToViewContainer) {
                    const t = this._lView[re];
                    if (Ne(t)) {
                        const n = t[8], r = n ? n.indexOf(this) : -1;
                        r > -1 && (ps(t, r), ns(n, r))
                    }
                    this._attachedToViewContainer = !1
                }
                oc(this._lView[C], this._lView)
            }

            onDestroy(t) {
                !function Rh(e, t) {
                    if (256 == (256 & e[k])) throw new w(911, !1);
                    null === e[un] && (e[un] = []), e[un].push(t)
                }(this._lView, t)
            }

            markForCheck() {
                jo(this._cdRefInjectingView || this._lView)
            }

            detach() {
                this._lView[k] &= -129
            }

            reattach() {
                this._lView[k] |= 128
            }

            detectChanges() {
                $s(this._lView[C], this._lView, this.context)
            }

            checkNoChanges() {
            }

            attachToViewContainerRef() {
                if (this._appRef) throw new w(902, !1);
                this._attachedToViewContainer = !0
            }

            detachFromAppRef() {
                this._appRef = null, function x_(e, t) {
                    Ro(e, t, t[P], 2, null, null)
                }(this._lView[C], this._lView)
            }

            attachToAppRef(t) {
                if (this._attachedToViewContainer) throw new w(902, !1);
                this._appRef = t
            }
        }

        class zM extends Vo {
            constructor(t) {
                super(t), this._view = t
            }

            detectChanges() {
                const t = this._view;
                $s(t[C], t, t[ae], !1)
            }

            checkNoChanges() {
            }

            get context() {
                return null
            }
        }

        class cm extends Ns {
            constructor(t) {
                super(), this.ngModule = t
            }

            resolveComponentFactory(t) {
                const n = V(t);
                return new Bo(n, this.ngModule)
            }
        }

        function lm(e) {
            const t = [];
            for (let n in e) e.hasOwnProperty(n) && t.push({propName: e[n], templateName: n});
            return t
        }

        class qM {
            constructor(t, n) {
                this.injector = t, this.parentInjector = n
            }

            get(t, n, r) {
                r = Li(r);
                const o = this.injector.get(t, Fc, r);
                return o !== Fc || n === Fc ? o : this.parentInjector.get(t, n, r)
            }
        }

        class Bo extends gg {
            get inputs() {
                const t = this.componentDef, n = t.inputTransforms, r = lm(t.inputs);
                if (null !== n) for (const o of r) n.hasOwnProperty(o.propName) && (o.transform = n[o.propName]);
                return r
            }

            get outputs() {
                return lm(this.componentDef.outputs)
            }

            constructor(t, n) {
                super(), this.componentDef = t, this.ngModule = n, this.componentType = t.type, this.selector = function TI(e) {
                    return e.map(MI).join(",")
                }(t.selectors), this.ngContentSelectors = t.ngContentSelectors ? t.ngContentSelectors : [], this.isBoundToModule = !!n
            }

            create(t, n, r, o) {
                let i = (o = o || this.ngModule) instanceof Qe ? o : o?.injector;
                i && null !== this.componentDef.getStandaloneInjector && (i = this.componentDef.getStandaloneInjector(i) || i);
                const s = i ? new qM(t, i) : t, a = s.get(vg, null);
                if (null === a) throw new w(407, !1);
                const d = {
                        rendererFactory: a,
                        sanitizer: s.get(VS, null),
                        effectManager: s.get(rm, null),
                        afterRenderEventManager: s.get(Vc, null)
                    }, f = a.createRenderer(null, this.componentDef), h = this.componentDef.selectors[0][0] || "div",
                    p = r ? function gM(e, t, n, r) {
                        const i = r.get(Og, !1) || n === ft.ShadowDom, s = e.selectRootElement(t, i);
                        return function mM(e) {
                            Gg(e)
                        }(s), s
                    }(f, r, this.componentDef.encapsulation, s) : hs(f, h, function GM(e) {
                        const t = e.toLowerCase();
                        return "svg" === t ? "svg" : "math" === t ? "math" : null
                    }(h)), D = this.componentDef.signals ? 4608 : this.componentDef.onPush ? 576 : 528;
                let m = null;
                null !== p && (m = xc(p, s, !0));
                const E = Wc(0, null, null, 1, 0, null, null, null, null, null, null),
                    M = ks(null, E, null, D, null, null, d, f, s, null, m);
                let j, ye;
                Lu(M);
                try {
                    const kt = this.componentDef;
                    let zn, cf = null;
                    kt.findHostDirectiveDefs ? (zn = [], cf = new Map, kt.findHostDirectiveDefs(kt, zn, cf), zn.push(kt)) : zn = [kt];
                    const Yk = function ZM(e, t) {
                        const n = e[C], r = H;
                        return e[r] = t, br(n, r, 2, "#host", null)
                    }(M, p), Qk = function YM(e, t, n, r, o, i, s) {
                        const a = o[C];
                        !function QM(e, t, n, r) {
                            for (const o of e) t.mergedAttrs = lo(t.mergedAttrs, o.hostAttrs);
                            null !== t.mergedAttrs && (js(t, t.mergedAttrs, !0), null !== n && Up(r, n, t))
                        }(r, e, t, s);
                        let u = null;
                        null !== t && (u = xc(t, o[an]));
                        const c = i.rendererFactory.createRenderer(t, n);
                        let l = 16;
                        n.signals ? l = 4096 : n.onPush && (l = 64);
                        const d = ks(o, zg(n), null, l, o[e.index], e, i, c, null, null, u);
                        return a.firstCreatePass && Yc(a, e, r.length - 1), Ls(o, d), o[e.index] = d
                    }(Yk, p, kt, zn, M, d, f);
                    ye = Mh(E, H), p && function JM(e, t, n, r) {
                        if (r) Cu(e, n, ["ng-version", BS.full]); else {
                            const {attrs: o, classes: i} = function AI(e) {
                                const t = [], n = [];
                                let r = 1, o = 2;
                                for (; r < e.length;) {
                                    let i = e[r];
                                    if ("string" == typeof i) 2 === o ? "" !== i && t.push(i, e[++r]) : 8 === o && n.push(i); else {
                                        if (!ht(o)) break;
                                        o = i
                                    }
                                    r++
                                }
                                return {attrs: t, classes: n}
                            }(t.selectors[0]);
                            o && Cu(e, n, o), i && i.length > 0 && Bp(e, n, i.join(" "))
                        }
                    }(f, kt, p, r), void 0 !== n && function KM(e, t, n) {
                        const r = e.projection = [];
                        for (let o = 0; o < t.length; o++) {
                            const i = n[o];
                            r.push(null != i ? Array.from(i) : null)
                        }
                    }(ye, this.ngContentSelectors, n), j = function XM(e, t, n, r, o, i) {
                        const s = Ie(), a = o[C], u = Ve(s, o);
                        Zg(a, o, s, n, null, r);
                        for (let l = 0; l < n.length; l++) _e(An(o, a, s.directiveStart + l, s), o);
                        Yg(a, o, s), u && _e(u, o);
                        const c = An(o, a, s.directiveStart + s.componentOffset, s);
                        if (e[ae] = o[ae] = c, null !== i) for (const l of i) l(c, t);
                        return zc(a, s, e), c
                    }(Qk, kt, zn, cf, M, [e0]), Kc(E, M, null)
                } finally {
                    ju()
                }
                return new WM(this.componentType, j, Cr(ye, M), M, ye)
            }
        }

        class WM extends FS {
            constructor(t, n, r, o, i) {
                super(), this.location = r, this._rootLView = o, this._tNode = i, this.previousInputValues = null, this.instance = n, this.hostView = this.changeDetectorRef = new zM(o), this.componentType = t
            }

            setInput(t, n) {
                const r = this._tNode.inputs;
                let o;
                if (null !== r && (o = r[t])) {
                    if (this.previousInputValues ??= new Map, this.previousInputValues.has(t) && Object.is(this.previousInputValues.get(t), n)) return;
                    const i = this._rootLView;
                    Jc(i[C], i, o, t, n), this.previousInputValues.set(t, n), jo(Ze(this._tNode.index, i))
                }
            }

            get injector() {
                return new Oe(this._tNode, this._rootLView)
            }

            destroy() {
                this.hostView.destroy()
            }

            onDestroy(t) {
                this.hostView.onDestroy(t)
            }
        }

        function e0() {
            const e = Ie();
            Zi(y()[C], e)
        }

        function Se(e, t, n) {
            return !Object.is(e[t], n) && (e[t] = n, !0)
        }

        let Nm = function Rm(e, t, n, r) {
            return dn(!0), t[P].createComment("")
        };

        function al(e, t, n) {
            const r = y();
            return Se(r, nr(), t) && function Xe(e, t, n, r, o, i, s, a) {
                const u = Ve(t, n);
                let l, c = t.inputs;
                !a && null != c && (l = c[r]) ? (Jc(e, n, l, r, o), _n(t) && function IM(e, t) {
                    const n = Ze(t, e);
                    16 & n[k] || (n[k] |= 64)
                }(n, t.index)) : 3 & t.type && (r = function EM(e) {
                    return "class" === e ? "className" : "for" === e ? "htmlFor" : "formaction" === e ? "formAction" : "innerHtml" === e ? "innerHTML" : "readonly" === e ? "readOnly" : "tabindex" === e ? "tabIndex" : e
                }(r), o = null != s ? s(o, t.value || "", r) : o, i.setProperty(u, r, o))
            }(B(), function oe() {
                const e = R.lFrame;
                return Mh(e.tView, e.selectedIndex)
            }(), r, e, t, r[P], n, !1), al
        }

        function ul(e, t, n, r, o) {
            const s = o ? "class" : "style";
            Jc(e, n, t.inputs[s], s, r)
        }

        function Pr(e, t, n, r) {
            const o = y(), i = B(), s = H + e, a = o[P], u = i.firstCreatePass ? function F0(e, t, n, r, o, i) {
                const s = t.consts, u = br(t, e, 2, r, ln(s, o));
                return Zc(t, n, u, ln(s, i)), null !== u.attrs && js(u, u.attrs, !1), null !== u.mergedAttrs && js(u, u.mergedAttrs, !0), null !== t.queries && t.queries.elementStart(t, u), u
            }(s, i, o, t, n, r) : i.data[s], c = xm(i, o, u, a, t, e);
            o[s] = c;
            const l = Ui(u);
            return Mt(u, !0), Up(a, c, u), 32 != (32 & u.flags) && Wi() && ms(i, o, c, u), 0 === function sb() {
                return R.lFrame.elementDepthCount
            }() && _e(c, o), function ab() {
                R.lFrame.elementDepthCount++
            }(), l && (Gc(i, o, u), zc(i, u, o)), null !== r && qc(o, u), Pr
        }

        function Fr() {
            let e = Ie();
            xu() ? function Ou() {
                R.lFrame.isParent = !1
            }() : (e = e.parent, Mt(e, !1));
            const t = e;
            (function cb(e) {
                return R.skipHydrationRootTNode === e
            })(t) && function hb() {
                R.skipHydrationRootTNode = null
            }(), function ub() {
                R.lFrame.elementDepthCount--
            }();
            const n = B();
            return n.firstCreatePass && (Zi(n, e), Iu(e) && n.queries.elementEnd(e)), null != t.classesWithoutHost && function Nb(e) {
                return 0 != (8 & e.flags)
            }(t) && ul(n, t, y(), t.classesWithoutHost, !0), null != t.stylesWithoutHost && function Rb(e) {
                return 0 != (16 & e.flags)
            }(t) && ul(n, t, y(), t.stylesWithoutHost, !1), Fr
        }

        function qs(e, t, n, r) {
            return Pr(e, t, n, r), Fr(), qs
        }

        let xm = (e, t, n, r, o, i) => (dn(!0), hs(r, o, function zh() {
            return R.lFrame.currentNamespace
        }()));

        function Ws(e) {
            return !!e && "function" == typeof e.then
        }

        function Fm(e) {
            return !!e && "function" == typeof e.subscribe
        }

        function Hm(e = 1) {
            return function Cb(e) {
                return (R.lFrame.contextLView = function Eb(e, t) {
                    for (; e > 0;) t = t[Qn], e--;
                    return t
                }(e, R.lFrame.contextLView))[ae]
            }(e)
        }

        function Qs(e, t = "") {
            const n = y(), r = B(), o = e + H, i = r.firstCreatePass ? br(r, o, 1, t, null) : r.data[o],
                s = dv(r, n, i, t, e);
            n[o] = s, Wi() && ms(r, n, s, i), Mt(i, !1)
        }

        let dv = (e, t, n, r, o) => (dn(!0), function fs(e, t) {
            return e.createText(t)
        }(t[P], r));

        function vl(e) {
            return yl("", e, ""), vl
        }

        function yl(e, t, n) {
            const r = y(), o = function Sr(e, t, n, r) {
                return Se(e, nr(), n) ? t + O(n) + r : F
            }(r, e, t, n);
            return o !== F && Wt(r, xe(), o), yl
        }

        const jr = "en-US";
        let Ov = jr;

        class kn {
        }

        class iy {
        }

        class _l extends kn {
            constructor(t, n, r) {
                super(), this._parent = n, this._bootstrapComponents = [], this.destroyCbs = [], this.componentFactoryResolver = new cm(this);
                const o = We(t);
                this._bootstrapComponents = qt(o.bootstrap), this._r3Injector = Eg(t, n, [{
                    provide: kn,
                    useValue: this
                }, {
                    provide: Ns,
                    useValue: this.componentFactoryResolver
                }, ...r], pe(t), new Set(["environment"])), this._r3Injector.resolveInjectorInitializers(), this.instance = this._r3Injector.get(t)
            }

            get injector() {
                return this._r3Injector
            }

            destroy() {
                const t = this._r3Injector;
                !t.destroyed && t.destroy(), this.destroyCbs.forEach(n => n()), this.destroyCbs = null
            }

            onDestroy(t) {
                this.destroyCbs.push(t)
            }
        }

        class Sl extends iy {
            constructor(t) {
                super(), this.moduleType = t
            }

            create(t) {
                return new _l(this.moduleType, t, [])
            }
        }

        class sy extends kn {
            constructor(t) {
                super(), this.componentFactoryResolver = new cm(this), this.instance = null;
                const n = new vr([...t.providers, {provide: kn, useValue: this}, {
                    provide: Ns,
                    useValue: this.componentFactoryResolver
                }], t.parent || Is(), t.debugName, new Set(["environment"]));
                this.injector = n, t.runEnvironmentInitializers && n.resolveInjectorInitializers()
            }

            destroy() {
                this.injector.destroy()
            }

            onDestroy(t) {
                this.injector.onDestroy(t)
            }
        }

        function Ml(e, t, n = null) {
            return new sy({providers: e, parent: t, debugName: n, runEnvironmentInitializers: !0}).injector
        }

        let jA = (() => {
            class e {
                constructor(n) {
                    this._injector = n, this.cachedInjectors = new Map
                }

                getOrCreateStandaloneInjector(n) {
                    if (!n.standalone) return null;
                    if (!this.cachedInjectors.has(n)) {
                        const r = ig(0, n.type),
                            o = r.length > 0 ? Ml([r], this._injector, `Standalone[${n.type.name}]`) : null;
                        this.cachedInjectors.set(n, o)
                    }
                    return this.cachedInjectors.get(n)
                }

                ngOnDestroy() {
                    try {
                        for (const n of this.cachedInjectors.values()) null !== n && n.destroy()
                    } finally {
                        this.cachedInjectors.clear()
                    }
                }

                static {
                    this.\u0275prov = S({token: e, providedIn: "environment", factory: () => new e(_(Qe))})
                }
            }

            return e
        })();

        function ay(e) {
            e.getStandaloneInjector = t => t.get(jA).getOrCreateStandaloneInjector(e)
        }

        function fN(e, t, n, r = !0) {
            const o = t[C];
            if (function P_(e, t, n, r) {
                const o = Ce + r, i = n.length;
                r > 0 && (n[o - 1][pt] = t), r < i - Ce ? (t[pt] = n[o], sp(n, Ce + r, t)) : (n.push(t), t[pt] = null), t[re] = n;
                const s = t[po];
                null !== s && n !== s && function F_(e, t) {
                    const n = e[Jn];
                    t[ue] !== t[re][re][ue] && (e[ih] = !0), null === n ? e[Jn] = [t] : n.push(t)
                }(s, t);
                const a = t[bt];
                null !== a && a.insertView(e), t[k] |= 128
            }(o, t, e, n), r) {
                const i = uc(n, e), s = t[P], a = gs(s, e[_t]);
                null !== a && function R_(e, t, n, r, o, i) {
                    r[ie] = o, r[be] = t, Ro(e, r, n, 1, o, i)
                }(o, e[be], s, t, a, i)
            }
        }

        let Zt = (() => {
            class e {
                static {
                    this.__NG_ELEMENT_ID__ = gN
                }
            }

            return e
        })();
        const hN = Zt, pN = class extends hN {
            constructor(t, n, r) {
                super(), this._declarationLView = t, this._declarationTContainer = n, this.elementRef = r
            }

            get ssrId() {
                return this._declarationTContainer.tView?.ssrId || null
            }

            createEmbeddedView(t, n) {
                return this.createEmbeddedViewImpl(t, n)
            }

            createEmbeddedViewImpl(t, n, r) {
                const o = function dN(e, t, n, r) {
                    const o = t.tView,
                        a = ks(e, o, n, 4096 & e[k] ? 4096 : 16, null, t, null, null, null, r?.injector ?? null, r?.hydrationInfo ?? null);
                    a[po] = e[t.index];
                    const c = e[bt];
                    return null !== c && (a[bt] = c.createEmbeddedView(o)), Kc(o, a, n), a
                }(this._declarationLView, this._declarationTContainer, t, {injector: n, hydrationInfo: r});
                return new Vo(o)
            }
        };

        function gN() {
            return function ta(e, t) {
                return 4 & e.type ? new pN(t, e, Cr(e, t)) : null
            }(Ie(), y())
        }

        let yt = (() => {
            class e {
                static {
                    this.__NG_ELEMENT_ID__ = CN
                }
            }

            return e
        })();

        function CN() {
            return function _y(e, t) {
                let n;
                const r = t[e.index];
                return Ne(r) ? n = r : (n = Xg(r, t, null, e), t[e.index] = n, Ls(t, n)), Sy(n, t, e, r), new Iy(n, e, t)
            }(Ie(), y())
        }

        const EN = yt, Iy = class extends EN {
            constructor(t, n, r) {
                super(), this._lContainer = t, this._hostTNode = n, this._hostLView = r
            }

            get element() {
                return Cr(this._hostTNode, this._hostLView)
            }

            get injector() {
                return new Oe(this._hostTNode, this._hostLView)
            }

            get parentInjector() {
                const t = Ki(this._hostTNode, this._hostLView);
                if (Vu(t)) {
                    const n = Io(t, this._hostLView), r = Eo(t);
                    return new Oe(n[C].data[r + 8], n)
                }
                return new Oe(null, this._hostLView)
            }

            clear() {
                for (; this.length > 0;) this.remove(this.length - 1)
            }

            get(t) {
                const n = by(this._lContainer);
                return null !== n && n[t] || null
            }

            get length() {
                return this._lContainer.length - Ce
            }

            createEmbeddedView(t, n, r) {
                let o, i;
                "number" == typeof r ? o = r : null != r && (o = r.index, i = r.injector);
                const a = t.createEmbeddedViewImpl(n || {}, i, null);
                return this.insertImpl(a, o, false), a
            }

            createComponent(t, n, r, o, i) {
                const s = t && !function _o(e) {
                    return "function" == typeof e
                }(t);
                let a;
                if (s) a = n; else {
                    const g = n || {};
                    a = g.index, r = g.injector, o = g.projectableNodes, i = g.environmentInjector || g.ngModuleRef
                }
                const u = s ? t : new Bo(V(t)), c = r || this.parentInjector;
                if (!i && null == u.ngModule) {
                    const v = (s ? c : this.parentInjector).get(Qe, null);
                    v && (i = v)
                }
                V(u.componentType ?? {});
                const h = u.create(c, o, null, i);
                return this.insertImpl(h.hostView, a, false), h
            }

            insert(t, n) {
                return this.insertImpl(t, n, !1)
            }

            insertImpl(t, n, r) {
                const o = t._lView;
                if (function rb(e) {
                    return Ne(e[re])
                }(o)) {
                    const u = this.indexOf(t);
                    if (-1 !== u) this.detach(u); else {
                        const c = o[re], l = new Iy(c, c[be], c[re]);
                        l.detach(l.indexOf(t))
                    }
                }
                const s = this._adjustIndex(n), a = this._lContainer;
                return fN(a, o, s, !r), t.attachToViewContainerRef(), sp(Nl(a), s, t), t
            }

            move(t, n) {
                return this.insert(t, n)
            }

            indexOf(t) {
                const n = by(this._lContainer);
                return null !== n ? n.indexOf(t) : -1
            }

            remove(t) {
                const n = this._adjustIndex(t, -1), r = ps(this._lContainer, n);
                r && (ns(Nl(this._lContainer), n), oc(r[C], r))
            }

            detach(t) {
                const n = this._adjustIndex(t, -1), r = ps(this._lContainer, n);
                return r && null != ns(Nl(this._lContainer), n) ? new Vo(r) : null
            }

            _adjustIndex(t, n = 0) {
                return t ?? this.length + n
            }
        };

        function by(e) {
            return e[8]
        }

        function Nl(e) {
            return e[8] || (e[8] = [])
        }

        let Sy = function My(e, t, n, r) {
            if (e[_t]) return;
            let o;
            o = 8 & n.type ? K(r) : function IN(e, t) {
                const n = e[P], r = n.createComment(""), o = Ve(t, e);
                return Nn(n, gs(n, o), r, function $_(e, t) {
                    return e.nextSibling(t)
                }(n, o), !1), r
            }(t, n), e[_t] = o
        };
        const Vl = new b("Application Initializer");
        let Bl = (() => {
            class e {
                constructor() {
                    this.initialized = !1, this.done = !1, this.donePromise = new Promise((n, r) => {
                        this.resolve = n, this.reject = r
                    }), this.appInits = I(Vl, {optional: !0}) ?? []
                }

                runInitializers() {
                    if (this.initialized) return;
                    const n = [];
                    for (const o of this.appInits) {
                        const i = o();
                        if (Ws(i)) n.push(i); else if (Fm(i)) {
                            const s = new Promise((a, u) => {
                                i.subscribe({complete: a, error: u})
                            });
                            n.push(s)
                        }
                    }
                    const r = () => {
                        this.done = !0, this.resolve()
                    };
                    Promise.all(n).then(() => {
                        r()
                    }).catch(o => {
                        this.reject(o)
                    }), 0 === n.length && r(), this.initialized = !0
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)
                    }
                }
                static {
                    this.\u0275prov = S({token: e, factory: e.\u0275fac, providedIn: "root"})
                }
            }

            return e
        })(), Jy = (() => {
            class e {
                log(n) {
                    console.log(n)
                }

                warn(n) {
                    console.warn(n)
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)
                    }
                }
                static {
                    this.\u0275prov = S({token: e, factory: e.\u0275fac, providedIn: "platform"})
                }
            }

            return e
        })();
        const Yt = new b("LocaleId", {
            providedIn: "root",
            factory: () => I(Yt, $.Optional | $.SkipSelf) || function eR() {
                return typeof $localize < "u" && $localize.locale || jr
            }()
        });
        let oa = (() => {
            class e {
                constructor() {
                    this.taskId = 0, this.pendingTasks = new Set, this.hasPendingTasks = new tt(!1)
                }

                add() {
                    this.hasPendingTasks.next(!0);
                    const n = this.taskId++;
                    return this.pendingTasks.add(n), n
                }

                remove(n) {
                    this.pendingTasks.delete(n), 0 === this.pendingTasks.size && this.hasPendingTasks.next(!1)
                }

                ngOnDestroy() {
                    this.pendingTasks.clear(), this.hasPendingTasks.next(!1)
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)
                    }
                }
                static {
                    this.\u0275prov = S({token: e, factory: e.\u0275fac, providedIn: "root"})
                }
            }

            return e
        })();

        class rR {
            constructor(t, n) {
                this.ngModuleFactory = t, this.componentFactories = n
            }
        }

        let Ky = (() => {
            class e {
                compileModuleSync(n) {
                    return new Sl(n)
                }

                compileModuleAsync(n) {
                    return Promise.resolve(this.compileModuleSync(n))
                }

                compileModuleAndAllComponentsSync(n) {
                    const r = this.compileModuleSync(n), i = qt(We(n).declarations).reduce((s, a) => {
                        const u = V(a);
                        return u && s.push(new Bo(u)), s
                    }, []);
                    return new rR(r, i)
                }

                compileModuleAndAllComponentsAsync(n) {
                    return Promise.resolve(this.compileModuleAndAllComponentsSync(n))
                }

                clearCache() {
                }

                clearCacheFor(n) {
                }

                getModuleId(n) {
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)
                    }
                }
                static {
                    this.\u0275prov = S({token: e, factory: e.\u0275fac, providedIn: "root"})
                }
            }

            return e
        })();
        const rD = new b(""), sa = new b("");
        let Wl, Gl = (() => {
            class e {
                constructor(n, r, o) {
                    this._ngZone = n, this.registry = r, this._pendingCount = 0, this._isZoneStable = !0, this._didWork = !1, this._callbacks = [], this.taskTrackingZone = null, Wl || (function _R(e) {
                        Wl = e
                    }(o), o.addToWindow(r)), this._watchAngularEvents(), n.run(() => {
                        this.taskTrackingZone = typeof Zone > "u" ? null : Zone.current.get("TaskTrackingZone")
                    })
                }

                _watchAngularEvents() {
                    this._ngZone.onUnstable.subscribe({
                        next: () => {
                            this._didWork = !0, this._isZoneStable = !1
                        }
                    }), this._ngZone.runOutsideAngular(() => {
                        this._ngZone.onStable.subscribe({
                            next: () => {
                                ee.assertNotInAngularZone(), queueMicrotask(() => {
                                    this._isZoneStable = !0, this._runCallbacksIfReady()
                                })
                            }
                        })
                    })
                }

                increasePendingRequestCount() {
                    return this._pendingCount += 1, this._didWork = !0, this._pendingCount
                }

                decreasePendingRequestCount() {
                    if (this._pendingCount -= 1, this._pendingCount < 0) throw new Error("pending async requests below zero");
                    return this._runCallbacksIfReady(), this._pendingCount
                }

                isStable() {
                    return this._isZoneStable && 0 === this._pendingCount && !this._ngZone.hasPendingMacrotasks
                }

                _runCallbacksIfReady() {
                    if (this.isStable()) queueMicrotask(() => {
                        for (; 0 !== this._callbacks.length;) {
                            let n = this._callbacks.pop();
                            clearTimeout(n.timeoutId), n.doneCb(this._didWork)
                        }
                        this._didWork = !1
                    }); else {
                        let n = this.getPendingTasks();
                        this._callbacks = this._callbacks.filter(r => !r.updateCb || !r.updateCb(n) || (clearTimeout(r.timeoutId), !1)), this._didWork = !0
                    }
                }

                getPendingTasks() {
                    return this.taskTrackingZone ? this.taskTrackingZone.macroTasks.map(n => ({
                        source: n.source,
                        creationLocation: n.creationLocation,
                        data: n.data
                    })) : []
                }

                addCallback(n, r, o) {
                    let i = -1;
                    r && r > 0 && (i = setTimeout(() => {
                        this._callbacks = this._callbacks.filter(s => s.timeoutId !== i), n(this._didWork, this.getPendingTasks())
                    }, r)), this._callbacks.push({doneCb: n, timeoutId: i, updateCb: o})
                }

                whenStable(n, r, o) {
                    if (o && !this.taskTrackingZone) throw new Error('Task tracking zone is required when passing an update callback to whenStable(). Is "zone.js/plugins/task-tracking" loaded?');
                    this.addCallback(n, r, o), this._runCallbacksIfReady()
                }

                getPendingRequestCount() {
                    return this._pendingCount
                }

                registerApplication(n) {
                    this.registry.registerApplication(n, this)
                }

                unregisterApplication(n) {
                    this.registry.unregisterApplication(n)
                }

                findProviders(n, r, o) {
                    return []
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)(_(ee), _(ql), _(sa))
                    }
                }
                static {
                    this.\u0275prov = S({token: e, factory: e.\u0275fac})
                }
            }

            return e
        })(), ql = (() => {
            class e {
                constructor() {
                    this._applications = new Map
                }

                registerApplication(n, r) {
                    this._applications.set(n, r)
                }

                unregisterApplication(n) {
                    this._applications.delete(n)
                }

                unregisterAllApplications() {
                    this._applications.clear()
                }

                getTestability(n) {
                    return this._applications.get(n) || null
                }

                getAllTestabilities() {
                    return Array.from(this._applications.values())
                }

                getAllRootElements() {
                    return Array.from(this._applications.keys())
                }

                findTestabilityInTree(n, r = !0) {
                    return Wl?.findTestabilityInTree(this, n, r) ?? null
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)
                    }
                }
                static {
                    this.\u0275prov = S({token: e, factory: e.\u0275fac, providedIn: "platform"})
                }
            }

            return e
        })(), mn = null;
        const oD = new b("AllowMultipleToken"), Zl = new b("PlatformDestroyListeners"),
            Yl = new b("appBootstrapListener");

        class sD {
            constructor(t, n) {
                this.name = t, this.token = n
            }
        }

        function uD(e, t, n = []) {
            const r = `Platform: ${t}`, o = new b(r);
            return (i = []) => {
                let s = Ql();
                if (!s || s.injector.get(oD, !1)) {
                    const a = [...n, ...i, {provide: o, useValue: !0}];
                    e ? e(a) : function TR(e) {
                        if (mn && !mn.get(oD, !1)) throw new w(400, !1);
                        (function iD() {
                            !function BI(e) {
                                vh = e
                            }(() => {
                                throw new w(600, !1)
                            })
                        })(), mn = e;
                        const t = e.get(lD);
                        (function aD(e) {
                            e.get(lg, null)?.forEach(n => n())
                        })(e)
                    }(function cD(e = [], t) {
                        return it.create({
                            name: t,
                            providers: [{provide: Cc, useValue: "platform"}, {
                                provide: Zl,
                                useValue: new Set([() => mn = null])
                            }, ...e]
                        })
                    }(a, r))
                }
                return function NR(e) {
                    const t = Ql();
                    if (!t) throw new w(401, !1);
                    return t
                }()
            }
        }

        function Ql() {
            return mn?.get(lD) ?? null
        }

        let lD = (() => {
            class e {
                constructor(n) {
                    this._injector = n, this._modules = [], this._destroyListeners = [], this._destroyed = !1
                }

                bootstrapModuleFactory(n, r) {
                    const o = function RR(e = "zone.js", t) {
                        return "noop" === e ? new tM : "zone.js" === e ? new ee(t) : e
                    }(r?.ngZone, function dD(e) {
                        return {
                            enableLongStackTrace: !1,
                            shouldCoalesceEventChangeDetection: e?.eventCoalescing ?? !1,
                            shouldCoalesceRunChangeDetection: e?.runCoalescing ?? !1
                        }
                    }({eventCoalescing: r?.ngZoneEventCoalescing, runCoalescing: r?.ngZoneRunCoalescing}));
                    return o.run(() => {
                        const i = function LA(e, t, n) {
                            return new _l(e, t, n)
                        }(n.moduleType, this.injector, function mD(e) {
                            return [{provide: ee, useFactory: e}, {
                                provide: Fo, multi: !0, useFactory: () => {
                                    const t = I(OR, {optional: !0});
                                    return () => t.initialize()
                                }
                            }, {provide: gD, useFactory: xR}, {provide: Mg, useFactory: Tg}]
                        }(() => o)), s = i.injector.get(Gt, null);
                        return o.runOutsideAngular(() => {
                            const a = o.onError.subscribe({
                                next: u => {
                                    s.handleError(u)
                                }
                            });
                            i.onDestroy(() => {
                                aa(this._modules, i), a.unsubscribe()
                            })
                        }), function fD(e, t, n) {
                            try {
                                const r = n();
                                return Ws(r) ? r.catch(o => {
                                    throw t.runOutsideAngular(() => e.handleError(o)), o
                                }) : r
                            } catch (r) {
                                throw t.runOutsideAngular(() => e.handleError(r)), r
                            }
                        }(s, o, () => {
                            const a = i.injector.get(Bl);
                            return a.runInitializers(), a.donePromise.then(() => (function Pv(e) {
                                nt(e, "Expected localeId to be defined"), "string" == typeof e && (Ov = e.toLowerCase().replace(/_/g, "-"))
                            }(i.injector.get(Yt, jr) || jr), this._moduleDoBootstrap(i), i))
                        })
                    })
                }

                bootstrapModule(n, r = []) {
                    const o = hD({}, r);
                    return function SR(e, t, n) {
                        const r = new Sl(n);
                        return Promise.resolve(r)
                    }(0, 0, n).then(i => this.bootstrapModuleFactory(i, o))
                }

                _moduleDoBootstrap(n) {
                    const r = n.injector.get(Vr);
                    if (n._bootstrapComponents.length > 0) n._bootstrapComponents.forEach(o => r.bootstrap(o)); else {
                        if (!n.instance.ngDoBootstrap) throw new w(-403, !1);
                        n.instance.ngDoBootstrap(r)
                    }
                    this._modules.push(n)
                }

                onDestroy(n) {
                    this._destroyListeners.push(n)
                }

                get injector() {
                    return this._injector
                }

                destroy() {
                    if (this._destroyed) throw new w(404, !1);
                    this._modules.slice().forEach(r => r.destroy()), this._destroyListeners.forEach(r => r());
                    const n = this._injector.get(Zl, null);
                    n && (n.forEach(r => r()), n.clear()), this._destroyed = !0
                }

                get destroyed() {
                    return this._destroyed
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)(_(it))
                    }
                }
                static {
                    this.\u0275prov = S({token: e, factory: e.\u0275fac, providedIn: "platform"})
                }
            }

            return e
        })();

        function hD(e, t) {
            return Array.isArray(t) ? t.reduce(hD, e) : {...e, ...t}
        }

        let Vr = (() => {
            class e {
                constructor() {
                    this._bootstrapListeners = [], this._runningTick = !1, this._destroyed = !1, this._destroyListeners = [], this._views = [], this.internalErrorHandler = I(gD), this.zoneIsStable = I(Mg), this.componentTypes = [], this.components = [], this.isStable = I(oa).hasPendingTasks.pipe(dt(n => n ? A(!1) : this.zoneIsStable), function KE(e, t = nn) {
                        return e = e ?? eI, fe((n, r) => {
                            let o, i = !0;
                            n.subscribe(he(r, s => {
                                const a = t(s);
                                (i || !e(o, a)) && (i = !1, o = a, r.next(s))
                            }))
                        })
                    }(), Ff()), this._injector = I(Qe)
                }

                get destroyed() {
                    return this._destroyed
                }

                get injector() {
                    return this._injector
                }

                bootstrap(n, r) {
                    const o = n instanceof gg;
                    if (!this._injector.get(Bl).done) throw !o && function Wn(e) {
                        const t = V(e) || we(e) || Ae(e);
                        return null !== t && t.standalone
                    }(n), new w(405, !1);
                    let s;
                    s = o ? n : this._injector.get(Ns).resolveComponentFactory(n), this.componentTypes.push(s.componentType);
                    const a = function MR(e) {
                            return e.isBoundToModule
                        }(s) ? void 0 : this._injector.get(kn), c = s.create(it.NULL, [], r || s.selector, a),
                        l = c.location.nativeElement, d = c.injector.get(rD, null);
                    return d?.registerApplication(l), c.onDestroy(() => {
                        this.detachView(c.hostView), aa(this.components, c), d?.unregisterApplication(l)
                    }), this._loadComponent(c), c
                }

                tick() {
                    if (this._runningTick) throw new w(101, !1);
                    try {
                        this._runningTick = !0;
                        for (let n of this._views) n.detectChanges()
                    } catch (n) {
                        this.internalErrorHandler(n)
                    } finally {
                        this._runningTick = !1
                    }
                }

                attachView(n) {
                    const r = n;
                    this._views.push(r), r.attachToAppRef(this)
                }

                detachView(n) {
                    const r = n;
                    aa(this._views, r), r.detachFromAppRef()
                }

                _loadComponent(n) {
                    this.attachView(n.hostView), this.tick(), this.components.push(n);
                    const r = this._injector.get(Yl, []);
                    r.push(...this._bootstrapListeners), r.forEach(o => o(n))
                }

                ngOnDestroy() {
                    if (!this._destroyed) try {
                        this._destroyListeners.forEach(n => n()), this._views.slice().forEach(n => n.destroy())
                    } finally {
                        this._destroyed = !0, this._views = [], this._bootstrapListeners = [], this._destroyListeners = []
                    }
                }

                onDestroy(n) {
                    return this._destroyListeners.push(n), () => aa(this._destroyListeners, n)
                }

                destroy() {
                    if (this._destroyed) throw new w(406, !1);
                    const n = this._injector;
                    n.destroy && !n.destroyed && n.destroy()
                }

                get viewCount() {
                    return this._views.length
                }

                warnIfDestroyed() {
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)
                    }
                }
                static {
                    this.\u0275prov = S({token: e, factory: e.\u0275fac, providedIn: "root"})
                }
            }

            return e
        })();

        function aa(e, t) {
            const n = e.indexOf(t);
            n > -1 && e.splice(n, 1)
        }

        const gD = new b("", {providedIn: "root", factory: () => I(Gt).handleError.bind(void 0)});

        function xR() {
            const e = I(ee), t = I(Gt);
            return n => e.runOutsideAngular(() => t.handleError(n))
        }

        let OR = (() => {
            class e {
                constructor() {
                    this.zone = I(ee), this.applicationRef = I(Vr)
                }

                initialize() {
                    this._onMicrotaskEmptySubscription || (this._onMicrotaskEmptySubscription = this.zone.onMicrotaskEmpty.subscribe({
                        next: () => {
                            this.zone.run(() => {
                                this.applicationRef.tick()
                            })
                        }
                    }))
                }

                ngOnDestroy() {
                    this._onMicrotaskEmptySubscription?.unsubscribe()
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)
                    }
                }
                static {
                    this.\u0275prov = S({token: e, factory: e.\u0275fac, providedIn: "root"})
                }
            }

            return e
        })();
        let Xl = (() => {
            class e {
                static {
                    this.__NG_ELEMENT_ID__ = FR
                }
            }

            return e
        })();

        function FR(e) {
            return function kR(e, t, n) {
                if (_n(e) && !n) {
                    const r = Ze(e.index, t);
                    return new Vo(r, r)
                }
                return 47 & e.type ? new Vo(t[ue], t) : null
            }(Ie(), y(), 16 == (16 & e))
        }

        const ZR = uD(null, "core", []);
        let YR = (() => {
            class e {
                constructor(n) {
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)(_(Vr))
                    }
                }
                static {
                    this.\u0275mod = sn({type: e})
                }
                static {
                    this.\u0275inj = jt({})
                }
            }

            return e
        })(), od = null;

        function Br() {
            return od
        }

        class cx {
        }

        const Je = new b("DocumentToken");
        let id = (() => {
            class e {
                historyGo(n) {
                    throw new Error("Not implemented")
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)
                    }
                }
                static {
                    this.\u0275prov = S({
                        token: e, factory: function () {
                            return I(dx)
                        }, providedIn: "platform"
                    })
                }
            }

            return e
        })();
        const lx = new b("Location Initialized");
        let dx = (() => {
            class e extends id {
                constructor() {
                    super(), this._doc = I(Je), this._location = window.location, this._history = window.history
                }

                getBaseHrefFromDOM() {
                    return Br().getBaseHref(this._doc)
                }

                onPopState(n) {
                    const r = Br().getGlobalEventTarget(this._doc, "window");
                    return r.addEventListener("popstate", n, !1), () => r.removeEventListener("popstate", n)
                }

                onHashChange(n) {
                    const r = Br().getGlobalEventTarget(this._doc, "window");
                    return r.addEventListener("hashchange", n, !1), () => r.removeEventListener("hashchange", n)
                }

                get href() {
                    return this._location.href
                }

                get protocol() {
                    return this._location.protocol
                }

                get hostname() {
                    return this._location.hostname
                }

                get port() {
                    return this._location.port
                }

                get pathname() {
                    return this._location.pathname
                }

                get search() {
                    return this._location.search
                }

                get hash() {
                    return this._location.hash
                }

                set pathname(n) {
                    this._location.pathname = n
                }

                pushState(n, r, o) {
                    this._history.pushState(n, r, o)
                }

                replaceState(n, r, o) {
                    this._history.replaceState(n, r, o)
                }

                forward() {
                    this._history.forward()
                }

                back() {
                    this._history.back()
                }

                historyGo(n = 0) {
                    this._history.go(n)
                }

                getState() {
                    return this._history.state
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)
                    }
                }
                static {
                    this.\u0275prov = S({
                        token: e, factory: function () {
                            return new e
                        }, providedIn: "platform"
                    })
                }
            }

            return e
        })();

        function sd(e, t) {
            if (0 == e.length) return t;
            if (0 == t.length) return e;
            let n = 0;
            return e.endsWith("/") && n++, t.startsWith("/") && n++, 2 == n ? e + t.substring(1) : 1 == n ? e + t : e + "/" + t
        }

        function FD(e) {
            const t = e.match(/#|\?|$/), n = t && t.index || e.length;
            return e.slice(0, n - ("/" === e[n - 1] ? 1 : 0)) + e.slice(n)
        }

        function Qt(e) {
            return e && "?" !== e[0] ? "?" + e : e
        }

        let jn = (() => {
            class e {
                historyGo(n) {
                    throw new Error("Not implemented")
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)
                    }
                }
                static {
                    this.\u0275prov = S({
                        token: e, factory: function () {
                            return I(LD)
                        }, providedIn: "root"
                    })
                }
            }

            return e
        })();
        const kD = new b("appBaseHref");
        let LD = (() => {
            class e extends jn {
                constructor(n, r) {
                    super(), this._platformLocation = n, this._removeListenerFns = [], this._baseHref = r ?? this._platformLocation.getBaseHrefFromDOM() ?? I(Je).location?.origin ?? ""
                }

                ngOnDestroy() {
                    for (; this._removeListenerFns.length;) this._removeListenerFns.pop()()
                }

                onPopState(n) {
                    this._removeListenerFns.push(this._platformLocation.onPopState(n), this._platformLocation.onHashChange(n))
                }

                getBaseHref() {
                    return this._baseHref
                }

                prepareExternalUrl(n) {
                    return sd(this._baseHref, n)
                }

                path(n = !1) {
                    const r = this._platformLocation.pathname + Qt(this._platformLocation.search),
                        o = this._platformLocation.hash;
                    return o && n ? `${r}${o}` : r
                }

                pushState(n, r, o, i) {
                    const s = this.prepareExternalUrl(o + Qt(i));
                    this._platformLocation.pushState(n, r, s)
                }

                replaceState(n, r, o, i) {
                    const s = this.prepareExternalUrl(o + Qt(i));
                    this._platformLocation.replaceState(n, r, s)
                }

                forward() {
                    this._platformLocation.forward()
                }

                back() {
                    this._platformLocation.back()
                }

                getState() {
                    return this._platformLocation.getState()
                }

                historyGo(n = 0) {
                    this._platformLocation.historyGo?.(n)
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)(_(id), _(kD, 8))
                    }
                }
                static {
                    this.\u0275prov = S({token: e, factory: e.\u0275fac, providedIn: "root"})
                }
            }

            return e
        })(), fx = (() => {
            class e extends jn {
                constructor(n, r) {
                    super(), this._platformLocation = n, this._baseHref = "", this._removeListenerFns = [], null != r && (this._baseHref = r)
                }

                ngOnDestroy() {
                    for (; this._removeListenerFns.length;) this._removeListenerFns.pop()()
                }

                onPopState(n) {
                    this._removeListenerFns.push(this._platformLocation.onPopState(n), this._platformLocation.onHashChange(n))
                }

                getBaseHref() {
                    return this._baseHref
                }

                path(n = !1) {
                    let r = this._platformLocation.hash;
                    return null == r && (r = "#"), r.length > 0 ? r.substring(1) : r
                }

                prepareExternalUrl(n) {
                    const r = sd(this._baseHref, n);
                    return r.length > 0 ? "#" + r : r
                }

                pushState(n, r, o, i) {
                    let s = this.prepareExternalUrl(o + Qt(i));
                    0 == s.length && (s = this._platformLocation.pathname), this._platformLocation.pushState(n, r, s)
                }

                replaceState(n, r, o, i) {
                    let s = this.prepareExternalUrl(o + Qt(i));
                    0 == s.length && (s = this._platformLocation.pathname), this._platformLocation.replaceState(n, r, s)
                }

                forward() {
                    this._platformLocation.forward()
                }

                back() {
                    this._platformLocation.back()
                }

                getState() {
                    return this._platformLocation.getState()
                }

                historyGo(n = 0) {
                    this._platformLocation.historyGo?.(n)
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)(_(id), _(kD, 8))
                    }
                }
                static {
                    this.\u0275prov = S({token: e, factory: e.\u0275fac})
                }
            }

            return e
        })(), ad = (() => {
            class e {
                constructor(n) {
                    this._subject = new Pe, this._urlChangeListeners = [], this._urlChangeSubscription = null, this._locationStrategy = n;
                    const r = this._locationStrategy.getBaseHref();
                    this._basePath = function gx(e) {
                        if (new RegExp("^(https?:)?//").test(e)) {
                            const [, n] = e.split(/\/\/[^\/]+/);
                            return n
                        }
                        return e
                    }(FD(jD(r))), this._locationStrategy.onPopState(o => {
                        this._subject.emit({url: this.path(!0), pop: !0, state: o.state, type: o.type})
                    })
                }

                ngOnDestroy() {
                    this._urlChangeSubscription?.unsubscribe(), this._urlChangeListeners = []
                }

                path(n = !1) {
                    return this.normalize(this._locationStrategy.path(n))
                }

                getState() {
                    return this._locationStrategy.getState()
                }

                isCurrentPathEqualTo(n, r = "") {
                    return this.path() == this.normalize(n + Qt(r))
                }

                normalize(n) {
                    return e.stripTrailingSlash(function px(e, t) {
                        if (!e || !t.startsWith(e)) return t;
                        const n = t.substring(e.length);
                        return "" === n || ["/", ";", "?", "#"].includes(n[0]) ? n : t
                    }(this._basePath, jD(n)))
                }

                prepareExternalUrl(n) {
                    return n && "/" !== n[0] && (n = "/" + n), this._locationStrategy.prepareExternalUrl(n)
                }

                go(n, r = "", o = null) {
                    this._locationStrategy.pushState(o, "", n, r), this._notifyUrlChangeListeners(this.prepareExternalUrl(n + Qt(r)), o)
                }

                replaceState(n, r = "", o = null) {
                    this._locationStrategy.replaceState(o, "", n, r), this._notifyUrlChangeListeners(this.prepareExternalUrl(n + Qt(r)), o)
                }

                forward() {
                    this._locationStrategy.forward()
                }

                back() {
                    this._locationStrategy.back()
                }

                historyGo(n = 0) {
                    this._locationStrategy.historyGo?.(n)
                }

                onUrlChange(n) {
                    return this._urlChangeListeners.push(n), this._urlChangeSubscription || (this._urlChangeSubscription = this.subscribe(r => {
                        this._notifyUrlChangeListeners(r.url, r.state)
                    })), () => {
                        const r = this._urlChangeListeners.indexOf(n);
                        this._urlChangeListeners.splice(r, 1), 0 === this._urlChangeListeners.length && (this._urlChangeSubscription?.unsubscribe(), this._urlChangeSubscription = null)
                    }
                }

                _notifyUrlChangeListeners(n = "", r) {
                    this._urlChangeListeners.forEach(o => o(n, r))
                }

                subscribe(n, r, o) {
                    return this._subject.subscribe({next: n, error: r, complete: o})
                }

                static {
                    this.normalizeQueryParams = Qt
                }
                static {
                    this.joinWithSlash = sd
                }
                static {
                    this.stripTrailingSlash = FD
                }
                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)(_(jn))
                    }
                }
                static {
                    this.\u0275prov = S({
                        token: e, factory: function () {
                            return function hx() {
                                return new ad(_(jn))
                            }()
                        }, providedIn: "root"
                    })
                }
            }

            return e
        })();

        function jD(e) {
            return e.replace(/\/index.html$/, "")
        }

        function WD(e, t) {
            t = encodeURIComponent(t);
            for (const n of e.split(";")) {
                const r = n.indexOf("="), [o, i] = -1 == r ? [n, ""] : [n.slice(0, r), n.slice(r + 1)];
                if (o.trim() === t) return decodeURIComponent(i)
            }
            return null
        }

        let XD = (() => {
            class e {
                constructor(n, r) {
                    this._viewContainer = n, this._context = new rO, this._thenTemplateRef = null, this._elseTemplateRef = null, this._thenViewRef = null, this._elseViewRef = null, this._thenTemplateRef = r
                }

                set ngIf(n) {
                    this._context.$implicit = this._context.ngIf = n, this._updateView()
                }

                set ngIfThen(n) {
                    JD("ngIfThen", n), this._thenTemplateRef = n, this._thenViewRef = null, this._updateView()
                }

                set ngIfElse(n) {
                    JD("ngIfElse", n), this._elseTemplateRef = n, this._elseViewRef = null, this._updateView()
                }

                _updateView() {
                    this._context.$implicit ? this._thenViewRef || (this._viewContainer.clear(), this._elseViewRef = null, this._thenTemplateRef && (this._thenViewRef = this._viewContainer.createEmbeddedView(this._thenTemplateRef, this._context))) : this._elseViewRef || (this._viewContainer.clear(), this._thenViewRef = null, this._elseTemplateRef && (this._elseViewRef = this._viewContainer.createEmbeddedView(this._elseTemplateRef, this._context)))
                }

                static ngTemplateContextGuard(n, r) {
                    return !0
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)(T(yt), T(Zt))
                    }
                }
                static {
                    this.\u0275dir = Te({
                        type: e,
                        selectors: [["", "ngIf", ""]],
                        inputs: {ngIf: "ngIf", ngIfThen: "ngIfThen", ngIfElse: "ngIfElse"},
                        standalone: !0
                    })
                }
            }

            return e
        })();

        class rO {
            constructor() {
                this.$implicit = null, this.ngIf = null
            }
        }

        function JD(e, t) {
            if (t && !t.createEmbeddedView) throw new Error(`${e} must be a TemplateRef, but received '${pe(t)}'.`)
        }

        let TO = (() => {
            class e {
                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)
                    }
                }
                static {
                    this.\u0275mod = sn({type: e})
                }
                static {
                    this.\u0275inj = jt({})
                }
            }

            return e
        })();

        function nw(e) {
            return "server" === e
        }

        let xO = (() => {
            class e {
                static {
                    this.\u0275prov = S({token: e, providedIn: "root", factory: () => new OO(_(Je), window)})
                }
            }

            return e
        })();

        class OO {
            constructor(t, n) {
                this.document = t, this.window = n, this.offset = () => [0, 0]
            }

            setOffset(t) {
                this.offset = Array.isArray(t) ? () => t : t
            }

            getScrollPosition() {
                return this.supportsScrolling() ? [this.window.pageXOffset, this.window.pageYOffset] : [0, 0]
            }

            scrollToPosition(t) {
                this.supportsScrolling() && this.window.scrollTo(t[0], t[1])
            }

            scrollToAnchor(t) {
                if (!this.supportsScrolling()) return;
                const n = function PO(e, t) {
                    const n = e.getElementById(t) || e.getElementsByName(t)[0];
                    if (n) return n;
                    if ("function" == typeof e.createTreeWalker && e.body && "function" == typeof e.body.attachShadow) {
                        const r = e.createTreeWalker(e.body, NodeFilter.SHOW_ELEMENT);
                        let o = r.currentNode;
                        for (; o;) {
                            const i = o.shadowRoot;
                            if (i) {
                                const s = i.getElementById(t) || i.querySelector(`[name="${t}"]`);
                                if (s) return s
                            }
                            o = r.nextNode()
                        }
                    }
                    return null
                }(this.document, t);
                n && (this.scrollToElement(n), n.focus())
            }

            setHistoryScrollRestoration(t) {
                this.supportsScrolling() && (this.window.history.scrollRestoration = t)
            }

            scrollToElement(t) {
                const n = t.getBoundingClientRect(), r = n.left + this.window.pageXOffset,
                    o = n.top + this.window.pageYOffset, i = this.offset();
                this.window.scrollTo(r - i[0], o - i[1])
            }

            supportsScrolling() {
                try {
                    return !!this.window && !!this.window.scrollTo && "pageXOffset" in this.window
                } catch {
                    return !1
                }
            }
        }

        class rw {
        }

        class rP extends cx {
            constructor() {
                super(...arguments), this.supportsDOMEvents = !0
            }
        }

        class bd extends rP {
            static makeCurrent() {
                !function ux(e) {
                    od || (od = e)
                }(new bd)
            }

            onAndCancel(t, n, r) {
                return t.addEventListener(n, r), () => {
                    t.removeEventListener(n, r)
                }
            }

            dispatchEvent(t, n) {
                t.dispatchEvent(n)
            }

            remove(t) {
                t.parentNode && t.parentNode.removeChild(t)
            }

            createElement(t, n) {
                return (n = n || this.getDefaultDocument()).createElement(t)
            }

            createHtmlDocument() {
                return document.implementation.createHTMLDocument("fakeTitle")
            }

            getDefaultDocument() {
                return document
            }

            isElementNode(t) {
                return t.nodeType === Node.ELEMENT_NODE
            }

            isShadowRoot(t) {
                return t instanceof DocumentFragment
            }

            getGlobalEventTarget(t, n) {
                return "window" === n ? window : "document" === n ? t : "body" === n ? t.body : null
            }

            getBaseHref(t) {
                const n = function oP() {
                    return ai = ai || document.querySelector("base"), ai ? ai.getAttribute("href") : null
                }();
                return null == n ? null : function iP(e) {
                    ba = ba || document.createElement("a"), ba.setAttribute("href", e);
                    const t = ba.pathname;
                    return "/" === t.charAt(0) ? t : `/${t}`
                }(n)
            }

            resetBaseElement() {
                ai = null
            }

            getUserAgent() {
                return window.navigator.userAgent
            }

            getCookie(t) {
                return WD(document.cookie, t)
            }
        }

        let ba, ai = null, aP = (() => {
            class e {
                build() {
                    return new XMLHttpRequest
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)
                    }
                }
                static {
                    this.\u0275prov = S({token: e, factory: e.\u0275fac})
                }
            }

            return e
        })();
        const _d = new b("EventManagerPlugins");
        let uw = (() => {
            class e {
                constructor(n, r) {
                    this._zone = r, this._eventNameToPlugin = new Map, n.forEach(o => {
                        o.manager = this
                    }), this._plugins = n.slice().reverse()
                }

                addEventListener(n, r, o) {
                    return this._findPluginFor(r).addEventListener(n, r, o)
                }

                getZone() {
                    return this._zone
                }

                _findPluginFor(n) {
                    let r = this._eventNameToPlugin.get(n);
                    if (r) return r;
                    if (r = this._plugins.find(i => i.supports(n)), !r) throw new w(5101, !1);
                    return this._eventNameToPlugin.set(n, r), r
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)(_(_d), _(ee))
                    }
                }
                static {
                    this.\u0275prov = S({token: e, factory: e.\u0275fac})
                }
            }

            return e
        })();

        class cw {
            constructor(t) {
                this._doc = t
            }
        }

        const Sd = "ng-app-id";
        let lw = (() => {
            class e {
                constructor(n, r, o, i = {}) {
                    this.doc = n, this.appId = r, this.nonce = o, this.platformId = i, this.styleRef = new Map, this.hostNodes = new Set, this.styleNodesInDOM = this.collectServerRenderedStyles(), this.platformIsServer = nw(i), this.resetHostNodes()
                }

                addStyles(n) {
                    for (const r of n) 1 === this.changeUsageCount(r, 1) && this.onStyleAdded(r)
                }

                removeStyles(n) {
                    for (const r of n) this.changeUsageCount(r, -1) <= 0 && this.onStyleRemoved(r)
                }

                ngOnDestroy() {
                    const n = this.styleNodesInDOM;
                    n && (n.forEach(r => r.remove()), n.clear());
                    for (const r of this.getAllStyles()) this.onStyleRemoved(r);
                    this.resetHostNodes()
                }

                addHost(n) {
                    this.hostNodes.add(n);
                    for (const r of this.getAllStyles()) this.addStyleToHost(n, r)
                }

                removeHost(n) {
                    this.hostNodes.delete(n)
                }

                getAllStyles() {
                    return this.styleRef.keys()
                }

                onStyleAdded(n) {
                    for (const r of this.hostNodes) this.addStyleToHost(r, n)
                }

                onStyleRemoved(n) {
                    const r = this.styleRef;
                    r.get(n)?.elements?.forEach(o => o.remove()), r.delete(n)
                }

                collectServerRenderedStyles() {
                    const n = this.doc.head?.querySelectorAll(`style[${Sd}="${this.appId}"]`);
                    if (n?.length) {
                        const r = new Map;
                        return n.forEach(o => {
                            null != o.textContent && r.set(o.textContent, o)
                        }), r
                    }
                    return null
                }

                changeUsageCount(n, r) {
                    const o = this.styleRef;
                    if (o.has(n)) {
                        const i = o.get(n);
                        return i.usage += r, i.usage
                    }
                    return o.set(n, {usage: r, elements: []}), r
                }

                getStyleElement(n, r) {
                    const o = this.styleNodesInDOM, i = o?.get(r);
                    if (i?.parentNode === n) return o.delete(r), i.removeAttribute(Sd), i;
                    {
                        const s = this.doc.createElement("style");
                        return this.nonce && s.setAttribute("nonce", this.nonce), s.textContent = r, this.platformIsServer && s.setAttribute(Sd, this.appId), s
                    }
                }

                addStyleToHost(n, r) {
                    const o = this.getStyleElement(n, r);
                    n.appendChild(o);
                    const i = this.styleRef, s = i.get(r)?.elements;
                    s ? s.push(o) : i.set(r, {elements: [o], usage: 1})
                }

                resetHostNodes() {
                    const n = this.hostNodes;
                    n.clear(), n.add(this.doc.head)
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)(_(Je), _(bs), _(dg, 8), _(xn))
                    }
                }
                static {
                    this.\u0275prov = S({token: e, factory: e.\u0275fac})
                }
            }

            return e
        })();
        const Md = {
            svg: "http://www.w3.org/2000/svg",
            xhtml: "http://www.w3.org/1999/xhtml",
            xlink: "http://www.w3.org/1999/xlink",
            xml: "http://www.w3.org/XML/1998/namespace",
            xmlns: "http://www.w3.org/2000/xmlns/",
            math: "http://www.w3.org/1998/MathML/"
        }, Td = /%COMP%/g, dP = new b("RemoveStylesOnCompDestroy", {providedIn: "root", factory: () => !1});

        function fw(e, t) {
            return t.map(n => n.replace(Td, e))
        }

        let hw = (() => {
            class e {
                constructor(n, r, o, i, s, a, u, c = null) {
                    this.eventManager = n, this.sharedStylesHost = r, this.appId = o, this.removeStylesOnCompDestroy = i, this.doc = s, this.platformId = a, this.ngZone = u, this.nonce = c, this.rendererByCompId = new Map, this.platformIsServer = nw(a), this.defaultRenderer = new Ad(n, s, u, this.platformIsServer)
                }

                createRenderer(n, r) {
                    if (!n || !r) return this.defaultRenderer;
                    this.platformIsServer && r.encapsulation === ft.ShadowDom && (r = {
                        ...r,
                        encapsulation: ft.Emulated
                    });
                    const o = this.getOrCreateRenderer(n, r);
                    return o instanceof gw ? o.applyToHost(n) : o instanceof Nd && o.applyStyles(), o
                }

                getOrCreateRenderer(n, r) {
                    const o = this.rendererByCompId;
                    let i = o.get(r.id);
                    if (!i) {
                        const s = this.doc, a = this.ngZone, u = this.eventManager, c = this.sharedStylesHost,
                            l = this.removeStylesOnCompDestroy, d = this.platformIsServer;
                        switch (r.encapsulation) {
                            case ft.Emulated:
                                i = new gw(u, c, r, this.appId, l, s, a, d);
                                break;
                            case ft.ShadowDom:
                                return new gP(u, c, n, r, s, a, this.nonce, d);
                            default:
                                i = new Nd(u, c, r, l, s, a, d)
                        }
                        o.set(r.id, i)
                    }
                    return i
                }

                ngOnDestroy() {
                    this.rendererByCompId.clear()
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)(_(uw), _(lw), _(bs), _(dP), _(Je), _(xn), _(ee), _(dg))
                    }
                }
                static {
                    this.\u0275prov = S({token: e, factory: e.\u0275fac})
                }
            }

            return e
        })();

        class Ad {
            constructor(t, n, r, o) {
                this.eventManager = t, this.doc = n, this.ngZone = r, this.platformIsServer = o, this.data = Object.create(null), this.destroyNode = null
            }

            destroy() {
            }

            createElement(t, n) {
                return n ? this.doc.createElementNS(Md[n] || n, t) : this.doc.createElement(t)
            }

            createComment(t) {
                return this.doc.createComment(t)
            }

            createText(t) {
                return this.doc.createTextNode(t)
            }

            appendChild(t, n) {
                (pw(t) ? t.content : t).appendChild(n)
            }

            insertBefore(t, n, r) {
                t && (pw(t) ? t.content : t).insertBefore(n, r)
            }

            removeChild(t, n) {
                t && t.removeChild(n)
            }

            selectRootElement(t, n) {
                let r = "string" == typeof t ? this.doc.querySelector(t) : t;
                if (!r) throw new w(-5104, !1);
                return n || (r.textContent = ""), r
            }

            parentNode(t) {
                return t.parentNode
            }

            nextSibling(t) {
                return t.nextSibling
            }

            setAttribute(t, n, r, o) {
                if (o) {
                    n = o + ":" + n;
                    const i = Md[o];
                    i ? t.setAttributeNS(i, n, r) : t.setAttribute(n, r)
                } else t.setAttribute(n, r)
            }

            removeAttribute(t, n, r) {
                if (r) {
                    const o = Md[r];
                    o ? t.removeAttributeNS(o, n) : t.removeAttribute(`${r}:${n}`)
                } else t.removeAttribute(n)
            }

            addClass(t, n) {
                t.classList.add(n)
            }

            removeClass(t, n) {
                t.classList.remove(n)
            }

            setStyle(t, n, r, o) {
                o & (fn.DashCase | fn.Important) ? t.style.setProperty(n, r, o & fn.Important ? "important" : "") : t.style[n] = r
            }

            removeStyle(t, n, r) {
                r & fn.DashCase ? t.style.removeProperty(n) : t.style[n] = ""
            }

            setProperty(t, n, r) {
                t[n] = r
            }

            setValue(t, n) {
                t.nodeValue = n
            }

            listen(t, n, r) {
                if ("string" == typeof t && !(t = Br().getGlobalEventTarget(this.doc, t))) throw new Error(`Unsupported event target ${t} for event ${n}`);
                return this.eventManager.addEventListener(t, n, this.decoratePreventDefault(r))
            }

            decoratePreventDefault(t) {
                return n => {
                    if ("__ngUnwrap__" === n) return t;
                    !1 === (this.platformIsServer ? this.ngZone.runGuarded(() => t(n)) : t(n)) && n.preventDefault()
                }
            }
        }

        function pw(e) {
            return "TEMPLATE" === e.tagName && void 0 !== e.content
        }

        class gP extends Ad {
            constructor(t, n, r, o, i, s, a, u) {
                super(t, i, s, u), this.sharedStylesHost = n, this.hostEl = r, this.shadowRoot = r.attachShadow({mode: "open"}), this.sharedStylesHost.addHost(this.shadowRoot);
                const c = fw(o.id, o.styles);
                for (const l of c) {
                    const d = document.createElement("style");
                    a && d.setAttribute("nonce", a), d.textContent = l, this.shadowRoot.appendChild(d)
                }
            }

            nodeOrShadowRoot(t) {
                return t === this.hostEl ? this.shadowRoot : t
            }

            appendChild(t, n) {
                return super.appendChild(this.nodeOrShadowRoot(t), n)
            }

            insertBefore(t, n, r) {
                return super.insertBefore(this.nodeOrShadowRoot(t), n, r)
            }

            removeChild(t, n) {
                return super.removeChild(this.nodeOrShadowRoot(t), n)
            }

            parentNode(t) {
                return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(t)))
            }

            destroy() {
                this.sharedStylesHost.removeHost(this.shadowRoot)
            }
        }

        class Nd extends Ad {
            constructor(t, n, r, o, i, s, a, u) {
                super(t, i, s, a), this.sharedStylesHost = n, this.removeStylesOnCompDestroy = o, this.styles = u ? fw(u, r.styles) : r.styles
            }

            applyStyles() {
                this.sharedStylesHost.addStyles(this.styles)
            }

            destroy() {
                this.removeStylesOnCompDestroy && this.sharedStylesHost.removeStyles(this.styles)
            }
        }

        class gw extends Nd {
            constructor(t, n, r, o, i, s, a, u) {
                const c = o + "-" + r.id;
                super(t, n, r, i, s, a, u, c), this.contentAttr = function fP(e) {
                    return "_ngcontent-%COMP%".replace(Td, e)
                }(c), this.hostAttr = function hP(e) {
                    return "_nghost-%COMP%".replace(Td, e)
                }(c)
            }

            applyToHost(t) {
                this.applyStyles(), this.setAttribute(t, this.hostAttr, "")
            }

            createElement(t, n) {
                const r = super.createElement(t, n);
                return super.setAttribute(r, this.contentAttr, ""), r
            }
        }

        let mP = (() => {
            class e extends cw {
                constructor(n) {
                    super(n)
                }

                supports(n) {
                    return !0
                }

                addEventListener(n, r, o) {
                    return n.addEventListener(r, o, !1), () => this.removeEventListener(n, r, o)
                }

                removeEventListener(n, r, o) {
                    return n.removeEventListener(r, o)
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)(_(Je))
                    }
                }
                static {
                    this.\u0275prov = S({token: e, factory: e.\u0275fac})
                }
            }

            return e
        })();
        const mw = ["alt", "control", "meta", "shift"], vP = {
            "\b": "Backspace",
            "\t": "Tab",
            "\x7f": "Delete",
            "\x1b": "Escape",
            Del: "Delete",
            Esc: "Escape",
            Left: "ArrowLeft",
            Right: "ArrowRight",
            Up: "ArrowUp",
            Down: "ArrowDown",
            Menu: "ContextMenu",
            Scroll: "ScrollLock",
            Win: "OS"
        }, yP = {alt: e => e.altKey, control: e => e.ctrlKey, meta: e => e.metaKey, shift: e => e.shiftKey};
        let DP = (() => {
            class e extends cw {
                constructor(n) {
                    super(n)
                }

                supports(n) {
                    return null != e.parseEventName(n)
                }

                addEventListener(n, r, o) {
                    const i = e.parseEventName(r), s = e.eventCallback(i.fullKey, o, this.manager.getZone());
                    return this.manager.getZone().runOutsideAngular(() => Br().onAndCancel(n, i.domEventName, s))
                }

                static parseEventName(n) {
                    const r = n.toLowerCase().split("."), o = r.shift();
                    if (0 === r.length || "keydown" !== o && "keyup" !== o) return null;
                    const i = e._normalizeKey(r.pop());
                    let s = "", a = r.indexOf("code");
                    if (a > -1 && (r.splice(a, 1), s = "code."), mw.forEach(c => {
                        const l = r.indexOf(c);
                        l > -1 && (r.splice(l, 1), s += c + ".")
                    }), s += i, 0 != r.length || 0 === i.length) return null;
                    const u = {};
                    return u.domEventName = o, u.fullKey = s, u
                }

                static matchEventFullKeyCode(n, r) {
                    let o = vP[n.key] || n.key, i = "";
                    return r.indexOf("code.") > -1 && (o = n.code, i = "code."), !(null == o || !o) && (o = o.toLowerCase(), " " === o ? o = "space" : "." === o && (o = "dot"), mw.forEach(s => {
                        s !== o && (0, yP[s])(n) && (i += s + ".")
                    }), i += o, i === r)
                }

                static eventCallback(n, r, o) {
                    return i => {
                        e.matchEventFullKeyCode(i, n) && o.runGuarded(() => r(i))
                    }
                }

                static _normalizeKey(n) {
                    return "esc" === n ? "escape" : n
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)(_(Je))
                    }
                }
                static {
                    this.\u0275prov = S({token: e, factory: e.\u0275fac})
                }
            }

            return e
        })();
        const IP = uD(ZR, "browser", [{provide: xn, useValue: "browser"}, {
                provide: lg, useValue: function wP() {
                    bd.makeCurrent()
                }, multi: !0
            }, {
                provide: Je, useFactory: function EP() {
                    return function W_(e) {
                        dc = e
                    }(document), document
                }, deps: []
            }]), bP = new b(""), Dw = [{
                provide: sa, useClass: class sP {
                    addToWindow(t) {
                        J.getAngularTestability = (r, o = !0) => {
                            const i = t.findTestabilityInTree(r, o);
                            if (null == i) throw new w(5103, !1);
                            return i
                        }, J.getAllAngularTestabilities = () => t.getAllTestabilities(), J.getAllAngularRootElements = () => t.getAllRootElements(), J.frameworkStabilizers || (J.frameworkStabilizers = []), J.frameworkStabilizers.push(r => {
                            const o = J.getAllAngularTestabilities();
                            let i = o.length, s = !1;
                            const a = function (u) {
                                s = s || u, i--, 0 == i && r(s)
                            };
                            o.forEach(u => {
                                u.whenStable(a)
                            })
                        })
                    }

                    findTestabilityInTree(t, n, r) {
                        return null == n ? null : t.getTestability(n) ?? (r ? Br().isShadowRoot(n) ? this.findTestabilityInTree(t, n.host, !0) : this.findTestabilityInTree(t, n.parentElement, !0) : null)
                    }
                }, deps: []
            }, {provide: rD, useClass: Gl, deps: [ee, ql, sa]}, {provide: Gl, useClass: Gl, deps: [ee, ql, sa]}],
            ww = [{provide: Cc, useValue: "root"}, {
                provide: Gt, useFactory: function CP() {
                    return new Gt
                }, deps: []
            }, {provide: _d, useClass: mP, multi: !0, deps: [Je, ee, xn]}, {
                provide: _d,
                useClass: DP,
                multi: !0,
                deps: [Je]
            }, hw, lw, uw, {provide: vg, useExisting: hw}, {provide: rw, useClass: aP, deps: []}, []];
        let _P = (() => {
            class e {
                constructor(n) {
                }

                static withServerTransition(n) {
                    return {ngModule: e, providers: [{provide: bs, useValue: n.appId}]}
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)(_(bP, 12))
                    }
                }
                static {
                    this.\u0275mod = sn({type: e})
                }
                static {
                    this.\u0275inj = jt({providers: [...ww, ...Dw], imports: [TO, YR]})
                }
            }

            return e
        })(), Cw = (() => {
            class e {
                constructor(n) {
                    this._doc = n
                }

                getTitle() {
                    return this._doc.title
                }

                setTitle(n) {
                    this._doc.title = n || ""
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)(_(Je))
                    }
                }
                static {
                    this.\u0275prov = S({
                        token: e, factory: function (r) {
                            let o = null;
                            return o = r ? new r : function MP() {
                                return new Cw(_(Je))
                            }(), o
                        }, providedIn: "root"
                    })
                }
            }

            return e
        })();
        typeof window < "u" && window;
        const {isArray: OP} = Array, {getPrototypeOf: PP, prototype: FP, keys: kP} = Object;
        const {isArray: $P} = Array;

        function xd(...e) {
            const t = so(e), n = function zE(e) {
                return Q(ou(e)) ? e.pop() : void 0
            }(e), {args: r, keys: o} = function LP(e) {
                if (1 === e.length) {
                    const t = e[0];
                    if (OP(t)) return {args: t, keys: null};
                    if (function jP(e) {
                        return e && "object" == typeof e && PP(e) === FP
                    }(t)) {
                        const n = kP(t);
                        return {args: n.map(r => t[r]), keys: n}
                    }
                }
                return {args: e, keys: null}
            }(e);
            if (0 === r.length) return ve([], t);
            const i = new le(function UP(e, t, n = nn) {
                return r => {
                    _w(t, () => {
                        const {length: o} = e, i = new Array(o);
                        let s = o, a = o;
                        for (let u = 0; u < o; u++) _w(t, () => {
                            const c = ve(e[u], t);
                            let l = !1;
                            c.subscribe(he(r, d => {
                                i[u] = d, l || (l = !0, a--), a || r.next(n(i.slice()))
                            }, () => {
                                --s || r.complete()
                            }))
                        }, r)
                    }, r)
                }
            }(r, t, o ? s => function BP(e, t) {
                return e.reduce((n, r, o) => (n[r] = t[o], n), {})
            }(o, s) : nn));
            return n ? i.pipe(function VP(e) {
                return q(t => function HP(e, t) {
                    return $P(t) ? e(...t) : e(t)
                }(e, t))
            }(n)) : i
        }

        function _w(e, t, n) {
            e ? Lt(n, e, t) : t()
        }

        const _a = ro(e => function () {
            e(this), this.name = "EmptyError", this.message = "no elements in sequence"
        });

        function Od(...e) {
            return function zP() {
                return Gn(1)
            }()(ve(e, so(e)))
        }

        function Sw(e) {
            return new le(t => {
                et(e()).subscribe(t)
            })
        }

        function ui(e, t) {
            const n = Q(e) ? e : () => e, r = o => o.error(n());
            return new le(t ? o => t.schedule(r, 0, o) : r)
        }

        function Pd() {
            return fe((e, t) => {
                let n = null;
                e._refCount++;
                const r = he(t, void 0, void 0, void 0, () => {
                    if (!e || e._refCount <= 0 || 0 < --e._refCount) return void (n = null);
                    const o = e._connection, i = n;
                    n = null, o && (!i || o === i) && o.unsubscribe(), t.unsubscribe()
                });
                e.subscribe(r), r.closed || (n = e.connect())
            })
        }

        class Mw extends le {
            constructor(t, n) {
                super(), this.source = t, this.subjectFactory = n, this._subject = null, this._refCount = 0, this._connection = null, vf(t) && (this.lift = t.lift)
            }

            _subscribe(t) {
                return this.getSubject().subscribe(t)
            }

            getSubject() {
                const t = this._subject;
                return (!t || t.isStopped) && (this._subject = this.subjectFactory()), this._subject
            }

            _teardown() {
                this._refCount = 0;
                const {_connection: t} = this;
                this._subject = this._connection = null, t?.unsubscribe()
            }

            connect() {
                let t = this._connection;
                if (!t) {
                    t = this._connection = new Ge;
                    const n = this.getSubject();
                    t.add(this.source.subscribe(he(n, void 0, () => {
                        this._teardown(), n.complete()
                    }, r => {
                        this._teardown(), n.error(r)
                    }, () => this._teardown()))), t.closed && (this._connection = null, t = Ge.EMPTY)
                }
                return t
            }

            refCount() {
                return Pd()(this)
            }
        }

        function zr(e) {
            return e <= 0 ? () => Et : fe((t, n) => {
                let r = 0;
                t.subscribe(he(n, o => {
                    ++r <= e && (n.next(o), e <= r && n.complete())
                }))
            })
        }

        function Kt(e, t) {
            return fe((n, r) => {
                let o = 0;
                n.subscribe(he(r, i => e.call(t, i, o++) && r.next(i)))
            })
        }

        function Sa(e) {
            return fe((t, n) => {
                let r = !1;
                t.subscribe(he(n, o => {
                    r = !0, n.next(o)
                }, () => {
                    r || n.next(e), n.complete()
                }))
            })
        }

        function Tw(e = qP) {
            return fe((t, n) => {
                let r = !1;
                t.subscribe(he(n, o => {
                    r = !0, n.next(o)
                }, () => r ? n.complete() : n.error(e())))
            })
        }

        function qP() {
            return new _a
        }

        function $n(e, t) {
            const n = arguments.length >= 2;
            return r => r.pipe(e ? Kt((o, i) => e(o, i, r)) : nn, zr(1), n ? Sa(t) : Tw(() => new _a))
        }

        function Gr(e, t) {
            return Q(t) ? De(e, t, 1) : De(e, 1)
        }

        function Me(e, t, n) {
            const r = Q(e) || t || n ? {next: e, error: t, complete: n} : e;
            return r ? fe((o, i) => {
                var s;
                null === (s = r.subscribe) || void 0 === s || s.call(r);
                let a = !0;
                o.subscribe(he(i, u => {
                    var c;
                    null === (c = r.next) || void 0 === c || c.call(r, u), i.next(u)
                }, () => {
                    var u;
                    a = !1, null === (u = r.complete) || void 0 === u || u.call(r), i.complete()
                }, u => {
                    var c;
                    a = !1, null === (c = r.error) || void 0 === c || c.call(r, u), i.error(u)
                }, () => {
                    var u, c;
                    a && (null === (u = r.unsubscribe) || void 0 === u || u.call(r)), null === (c = r.finalize) || void 0 === c || c.call(r)
                }))
            }) : nn
        }

        function Hn(e) {
            return fe((t, n) => {
                let i, r = null, o = !1;
                r = t.subscribe(he(n, void 0, void 0, s => {
                    i = et(e(s, Hn(e)(t))), r ? (r.unsubscribe(), r = null, i.subscribe(n)) : o = !0
                })), o && (r.unsubscribe(), r = null, i.subscribe(n))
            })
        }

        function Fd(e) {
            return e <= 0 ? () => Et : fe((t, n) => {
                let r = [];
                t.subscribe(he(n, o => {
                    r.push(o), e < r.length && r.shift()
                }, () => {
                    for (const o of r) n.next(o);
                    n.complete()
                }, void 0, () => {
                    r = null
                }))
            })
        }

        function ci(e) {
            return fe((t, n) => {
                try {
                    t.subscribe(n)
                } finally {
                    n.add(e)
                }
            })
        }

        const L = "primary", li = Symbol("RouteTitle");

        class JP {
            constructor(t) {
                this.params = t || {}
            }

            has(t) {
                return Object.prototype.hasOwnProperty.call(this.params, t)
            }

            get(t) {
                if (this.has(t)) {
                    const n = this.params[t];
                    return Array.isArray(n) ? n[0] : n
                }
                return null
            }

            getAll(t) {
                if (this.has(t)) {
                    const n = this.params[t];
                    return Array.isArray(n) ? n : [n]
                }
                return []
            }

            get keys() {
                return Object.keys(this.params)
            }
        }

        function qr(e) {
            return new JP(e)
        }

        function KP(e, t, n) {
            const r = n.path.split("/");
            if (r.length > e.length || "full" === n.pathMatch && (t.hasChildren() || r.length < e.length)) return null;
            const o = {};
            for (let i = 0; i < r.length; i++) {
                const s = r[i], a = e[i];
                if (s.startsWith(":")) o[s.substring(1)] = a; else if (s !== a.path) return null
            }
            return {consumed: e.slice(0, r.length), posParams: o}
        }

        function Ot(e, t) {
            const n = e ? Object.keys(e) : void 0, r = t ? Object.keys(t) : void 0;
            if (!n || !r || n.length != r.length) return !1;
            let o;
            for (let i = 0; i < n.length; i++) if (o = n[i], !Aw(e[o], t[o])) return !1;
            return !0
        }

        function Aw(e, t) {
            if (Array.isArray(e) && Array.isArray(t)) {
                if (e.length !== t.length) return !1;
                const n = [...e].sort(), r = [...t].sort();
                return n.every((o, i) => r[i] === o)
            }
            return e === t
        }

        function Nw(e) {
            return e.length > 0 ? e[e.length - 1] : null
        }

        function yn(e) {
            return function xP(e) {
                return !!e && (e instanceof le || Q(e.lift) && Q(e.subscribe))
            }(e) ? e : Ws(e) ? ve(Promise.resolve(e)) : A(e)
        }

        const tF = {
            exact: function Ow(e, t, n) {
                if (!Vn(e.segments, t.segments) || !Ma(e.segments, t.segments, n) || e.numberOfChildren !== t.numberOfChildren) return !1;
                for (const r in t.children) if (!e.children[r] || !Ow(e.children[r], t.children[r], n)) return !1;
                return !0
            }, subset: Pw
        }, Rw = {
            exact: function nF(e, t) {
                return Ot(e, t)
            }, subset: function rF(e, t) {
                return Object.keys(t).length <= Object.keys(e).length && Object.keys(t).every(n => Aw(e[n], t[n]))
            }, ignored: () => !0
        };

        function xw(e, t, n) {
            return tF[n.paths](e.root, t.root, n.matrixParams) && Rw[n.queryParams](e.queryParams, t.queryParams) && !("exact" === n.fragment && e.fragment !== t.fragment)
        }

        function Pw(e, t, n) {
            return Fw(e, t, t.segments, n)
        }

        function Fw(e, t, n, r) {
            if (e.segments.length > n.length) {
                const o = e.segments.slice(0, n.length);
                return !(!Vn(o, n) || t.hasChildren() || !Ma(o, n, r))
            }
            if (e.segments.length === n.length) {
                if (!Vn(e.segments, n) || !Ma(e.segments, n, r)) return !1;
                for (const o in t.children) if (!e.children[o] || !Pw(e.children[o], t.children[o], r)) return !1;
                return !0
            }
            {
                const o = n.slice(0, e.segments.length), i = n.slice(e.segments.length);
                return !!(Vn(e.segments, o) && Ma(e.segments, o, r) && e.children[L]) && Fw(e.children[L], t, i, r)
            }
        }

        function Ma(e, t, n) {
            return t.every((r, o) => Rw[n](e[o].parameters, r.parameters))
        }

        class Wr {
            constructor(t = new Y([], {}), n = {}, r = null) {
                this.root = t, this.queryParams = n, this.fragment = r
            }

            get queryParamMap() {
                return this._queryParamMap || (this._queryParamMap = qr(this.queryParams)), this._queryParamMap
            }

            toString() {
                return sF.serialize(this)
            }
        }

        class Y {
            constructor(t, n) {
                this.segments = t, this.children = n, this.parent = null, Object.values(n).forEach(r => r.parent = this)
            }

            hasChildren() {
                return this.numberOfChildren > 0
            }

            get numberOfChildren() {
                return Object.keys(this.children).length
            }

            toString() {
                return Ta(this)
            }
        }

        class di {
            constructor(t, n) {
                this.path = t, this.parameters = n
            }

            get parameterMap() {
                return this._parameterMap || (this._parameterMap = qr(this.parameters)), this._parameterMap
            }

            toString() {
                return jw(this)
            }
        }

        function Vn(e, t) {
            return e.length === t.length && e.every((n, r) => n.path === t[r].path)
        }

        let fi = (() => {
            class e {
                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)
                    }
                }
                static {
                    this.\u0275prov = S({
                        token: e, factory: function () {
                            return new kd
                        }, providedIn: "root"
                    })
                }
            }

            return e
        })();

        class kd {
            parse(t) {
                const n = new vF(t);
                return new Wr(n.parseRootSegment(), n.parseQueryParams(), n.parseFragment())
            }

            serialize(t) {
                const n = `/${hi(t.root, !0)}`, r = function cF(e) {
                    const t = Object.keys(e).map(n => {
                        const r = e[n];
                        return Array.isArray(r) ? r.map(o => `${Aa(n)}=${Aa(o)}`).join("&") : `${Aa(n)}=${Aa(r)}`
                    }).filter(n => !!n);
                    return t.length ? `?${t.join("&")}` : ""
                }(t.queryParams);
                return `${n}${r}${"string" == typeof t.fragment ? `#${function aF(e) {
                    return encodeURI(e)
                }(t.fragment)}` : ""}`
            }
        }

        const sF = new kd;

        function Ta(e) {
            return e.segments.map(t => jw(t)).join("/")
        }

        function hi(e, t) {
            if (!e.hasChildren()) return Ta(e);
            if (t) {
                const n = e.children[L] ? hi(e.children[L], !1) : "", r = [];
                return Object.entries(e.children).forEach(([o, i]) => {
                    o !== L && r.push(`${o}:${hi(i, !1)}`)
                }), r.length > 0 ? `${n}(${r.join("//")})` : n
            }
            {
                const n = function iF(e, t) {
                    let n = [];
                    return Object.entries(e.children).forEach(([r, o]) => {
                        r === L && (n = n.concat(t(o, r)))
                    }), Object.entries(e.children).forEach(([r, o]) => {
                        r !== L && (n = n.concat(t(o, r)))
                    }), n
                }(e, (r, o) => o === L ? [hi(e.children[L], !1)] : [`${o}:${hi(r, !1)}`]);
                return 1 === Object.keys(e.children).length && null != e.children[L] ? `${Ta(e)}/${n[0]}` : `${Ta(e)}/(${n.join("//")})`
            }
        }

        function kw(e) {
            return encodeURIComponent(e).replace(/%40/g, "@").replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",")
        }

        function Aa(e) {
            return kw(e).replace(/%3B/gi, ";")
        }

        function Ld(e) {
            return kw(e).replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/%26/gi, "&")
        }

        function Na(e) {
            return decodeURIComponent(e)
        }

        function Lw(e) {
            return Na(e.replace(/\+/g, "%20"))
        }

        function jw(e) {
            return `${Ld(e.path)}${function uF(e) {
                return Object.keys(e).map(t => `;${Ld(t)}=${Ld(e[t])}`).join("")
            }(e.parameters)}`
        }

        const lF = /^[^\/()?;#]+/;

        function jd(e) {
            const t = e.match(lF);
            return t ? t[0] : ""
        }

        const dF = /^[^\/()?;=#]+/, hF = /^[^=?&#]+/, gF = /^[^&#]+/;

        class vF {
            constructor(t) {
                this.url = t, this.remaining = t
            }

            parseRootSegment() {
                return this.consumeOptional("/"), "" === this.remaining || this.peekStartsWith("?") || this.peekStartsWith("#") ? new Y([], {}) : new Y([], this.parseChildren())
            }

            parseQueryParams() {
                const t = {};
                if (this.consumeOptional("?")) do {
                    this.parseQueryParam(t)
                } while (this.consumeOptional("&"));
                return t
            }

            parseFragment() {
                return this.consumeOptional("#") ? decodeURIComponent(this.remaining) : null
            }

            parseChildren() {
                if ("" === this.remaining) return {};
                this.consumeOptional("/");
                const t = [];
                for (this.peekStartsWith("(") || t.push(this.parseSegment()); this.peekStartsWith("/") && !this.peekStartsWith("//") && !this.peekStartsWith("/(");) this.capture("/"), t.push(this.parseSegment());
                let n = {};
                this.peekStartsWith("/(") && (this.capture("/"), n = this.parseParens(!0));
                let r = {};
                return this.peekStartsWith("(") && (r = this.parseParens(!1)), (t.length > 0 || Object.keys(n).length > 0) && (r[L] = new Y(t, n)), r
            }

            parseSegment() {
                const t = jd(this.remaining);
                if ("" === t && this.peekStartsWith(";")) throw new w(4009, !1);
                return this.capture(t), new di(Na(t), this.parseMatrixParams())
            }

            parseMatrixParams() {
                const t = {};
                for (; this.consumeOptional(";");) this.parseParam(t);
                return t
            }

            parseParam(t) {
                const n = function fF(e) {
                    const t = e.match(dF);
                    return t ? t[0] : ""
                }(this.remaining);
                if (!n) return;
                this.capture(n);
                let r = "";
                if (this.consumeOptional("=")) {
                    const o = jd(this.remaining);
                    o && (r = o, this.capture(r))
                }
                t[Na(n)] = Na(r)
            }

            parseQueryParam(t) {
                const n = function pF(e) {
                    const t = e.match(hF);
                    return t ? t[0] : ""
                }(this.remaining);
                if (!n) return;
                this.capture(n);
                let r = "";
                if (this.consumeOptional("=")) {
                    const s = function mF(e) {
                        const t = e.match(gF);
                        return t ? t[0] : ""
                    }(this.remaining);
                    s && (r = s, this.capture(r))
                }
                const o = Lw(n), i = Lw(r);
                if (t.hasOwnProperty(o)) {
                    let s = t[o];
                    Array.isArray(s) || (s = [s], t[o] = s), s.push(i)
                } else t[o] = i
            }

            parseParens(t) {
                const n = {};
                for (this.capture("("); !this.consumeOptional(")") && this.remaining.length > 0;) {
                    const r = jd(this.remaining), o = this.remaining[r.length];
                    if ("/" !== o && ")" !== o && ";" !== o) throw new w(4010, !1);
                    let i;
                    r.indexOf(":") > -1 ? (i = r.slice(0, r.indexOf(":")), this.capture(i), this.capture(":")) : t && (i = L);
                    const s = this.parseChildren();
                    n[i] = 1 === Object.keys(s).length ? s[L] : new Y([], s), this.consumeOptional("//")
                }
                return n
            }

            peekStartsWith(t) {
                return this.remaining.startsWith(t)
            }

            consumeOptional(t) {
                return !!this.peekStartsWith(t) && (this.remaining = this.remaining.substring(t.length), !0)
            }

            capture(t) {
                if (!this.consumeOptional(t)) throw new w(4011, !1)
            }
        }

        function $w(e) {
            return e.segments.length > 0 ? new Y([], {[L]: e}) : e
        }

        function Hw(e) {
            const t = {};
            for (const r of Object.keys(e.children)) {
                const i = Hw(e.children[r]);
                if (r === L && 0 === i.segments.length && i.hasChildren()) for (const [s, a] of Object.entries(i.children)) t[s] = a; else (i.segments.length > 0 || i.hasChildren()) && (t[r] = i)
            }
            return function yF(e) {
                if (1 === e.numberOfChildren && e.children[L]) {
                    const t = e.children[L];
                    return new Y(e.segments.concat(t.segments), t.children)
                }
                return e
            }(new Y(e.segments, t))
        }

        function Bn(e) {
            return e instanceof Wr
        }

        function Vw(e) {
            let t;
            const o = $w(function n(i) {
                const s = {};
                for (const u of i.children) {
                    const c = n(u);
                    s[u.outlet] = c
                }
                const a = new Y(i.url, s);
                return i === e && (t = a), a
            }(e.root));
            return t ?? o
        }

        function Bw(e, t, n, r) {
            let o = e;
            for (; o.parent;) o = o.parent;
            if (0 === t.length) return $d(o, o, o, n, r);
            const i = function wF(e) {
                if ("string" == typeof e[0] && 1 === e.length && "/" === e[0]) return new zw(!0, 0, e);
                let t = 0, n = !1;
                const r = e.reduce((o, i, s) => {
                    if ("object" == typeof i && null != i) {
                        if (i.outlets) {
                            const a = {};
                            return Object.entries(i.outlets).forEach(([u, c]) => {
                                a[u] = "string" == typeof c ? c.split("/") : c
                            }), [...o, {outlets: a}]
                        }
                        if (i.segmentPath) return [...o, i.segmentPath]
                    }
                    return "string" != typeof i ? [...o, i] : 0 === s ? (i.split("/").forEach((a, u) => {
                        0 == u && "." === a || (0 == u && "" === a ? n = !0 : ".." === a ? t++ : "" != a && o.push(a))
                    }), o) : [...o, i]
                }, []);
                return new zw(n, t, r)
            }(t);
            if (i.toRoot()) return $d(o, o, new Y([], {}), n, r);
            const s = function CF(e, t, n) {
                    if (e.isAbsolute) return new xa(t, !0, 0);
                    if (!n) return new xa(t, !1, NaN);
                    if (null === n.parent) return new xa(n, !0, 0);
                    const r = Ra(e.commands[0]) ? 0 : 1;
                    return function EF(e, t, n) {
                        let r = e, o = t, i = n;
                        for (; i > o;) {
                            if (i -= o, r = r.parent, !r) throw new w(4005, !1);
                            o = r.segments.length
                        }
                        return new xa(r, !1, o - i)
                    }(n, n.segments.length - 1 + r, e.numberOfDoubleDots)
                }(i, o, e),
                a = s.processChildren ? gi(s.segmentGroup, s.index, i.commands) : Gw(s.segmentGroup, s.index, i.commands);
            return $d(o, s.segmentGroup, a, n, r)
        }

        function Ra(e) {
            return "object" == typeof e && null != e && !e.outlets && !e.segmentPath
        }

        function pi(e) {
            return "object" == typeof e && null != e && e.outlets
        }

        function $d(e, t, n, r, o) {
            let s, i = {};
            r && Object.entries(r).forEach(([u, c]) => {
                i[u] = Array.isArray(c) ? c.map(l => `${l}`) : `${c}`
            }), s = e === t ? n : Uw(e, t, n);
            const a = $w(Hw(s));
            return new Wr(a, i, o)
        }

        function Uw(e, t, n) {
            const r = {};
            return Object.entries(e.children).forEach(([o, i]) => {
                r[o] = i === t ? n : Uw(i, t, n)
            }), new Y(e.segments, r)
        }

        class zw {
            constructor(t, n, r) {
                if (this.isAbsolute = t, this.numberOfDoubleDots = n, this.commands = r, t && r.length > 0 && Ra(r[0])) throw new w(4003, !1);
                const o = r.find(pi);
                if (o && o !== Nw(r)) throw new w(4004, !1)
            }

            toRoot() {
                return this.isAbsolute && 1 === this.commands.length && "/" == this.commands[0]
            }
        }

        class xa {
            constructor(t, n, r) {
                this.segmentGroup = t, this.processChildren = n, this.index = r
            }
        }

        function Gw(e, t, n) {
            if (e || (e = new Y([], {})), 0 === e.segments.length && e.hasChildren()) return gi(e, t, n);
            const r = function bF(e, t, n) {
                let r = 0, o = t;
                const i = {match: !1, pathIndex: 0, commandIndex: 0};
                for (; o < e.segments.length;) {
                    if (r >= n.length) return i;
                    const s = e.segments[o], a = n[r];
                    if (pi(a)) break;
                    const u = `${a}`, c = r < n.length - 1 ? n[r + 1] : null;
                    if (o > 0 && void 0 === u) break;
                    if (u && c && "object" == typeof c && void 0 === c.outlets) {
                        if (!Ww(u, c, s)) return i;
                        r += 2
                    } else {
                        if (!Ww(u, {}, s)) return i;
                        r++
                    }
                    o++
                }
                return {match: !0, pathIndex: o, commandIndex: r}
            }(e, t, n), o = n.slice(r.commandIndex);
            if (r.match && r.pathIndex < e.segments.length) {
                const i = new Y(e.segments.slice(0, r.pathIndex), {});
                return i.children[L] = new Y(e.segments.slice(r.pathIndex), e.children), gi(i, 0, o)
            }
            return r.match && 0 === o.length ? new Y(e.segments, {}) : r.match && !e.hasChildren() ? Hd(e, t, n) : r.match ? gi(e, 0, o) : Hd(e, t, n)
        }

        function gi(e, t, n) {
            if (0 === n.length) return new Y(e.segments, {});
            {
                const r = function IF(e) {
                    return pi(e[0]) ? e[0].outlets : {[L]: e}
                }(n), o = {};
                if (Object.keys(r).some(i => i !== L) && e.children[L] && 1 === e.numberOfChildren && 0 === e.children[L].segments.length) {
                    const i = gi(e.children[L], t, n);
                    return new Y(e.segments, i.children)
                }
                return Object.entries(r).forEach(([i, s]) => {
                    "string" == typeof s && (s = [s]), null !== s && (o[i] = Gw(e.children[i], t, s))
                }), Object.entries(e.children).forEach(([i, s]) => {
                    void 0 === r[i] && (o[i] = s)
                }), new Y(e.segments, o)
            }
        }

        function Hd(e, t, n) {
            const r = e.segments.slice(0, t);
            let o = 0;
            for (; o < n.length;) {
                const i = n[o];
                if (pi(i)) {
                    const u = _F(i.outlets);
                    return new Y(r, u)
                }
                if (0 === o && Ra(n[0])) {
                    r.push(new di(e.segments[t].path, qw(n[0]))), o++;
                    continue
                }
                const s = pi(i) ? i.outlets[L] : `${i}`, a = o < n.length - 1 ? n[o + 1] : null;
                s && a && Ra(a) ? (r.push(new di(s, qw(a))), o += 2) : (r.push(new di(s, {})), o++)
            }
            return new Y(r, {})
        }

        function _F(e) {
            const t = {};
            return Object.entries(e).forEach(([n, r]) => {
                "string" == typeof r && (r = [r]), null !== r && (t[n] = Hd(new Y([], {}), 0, r))
            }), t
        }

        function qw(e) {
            const t = {};
            return Object.entries(e).forEach(([n, r]) => t[n] = `${r}`), t
        }

        function Ww(e, t, n) {
            return e == n.path && Ot(t, n.parameters)
        }

        const mi = "imperative";

        class Pt {
            constructor(t, n) {
                this.id = t, this.url = n
            }
        }

        class Oa extends Pt {
            constructor(t, n, r = "imperative", o = null) {
                super(t, n), this.type = 0, this.navigationTrigger = r, this.restoredState = o
            }

            toString() {
                return `NavigationStart(id: ${this.id}, url: '${this.url}')`
            }
        }

        class Dn extends Pt {
            constructor(t, n, r) {
                super(t, n), this.urlAfterRedirects = r, this.type = 1
            }

            toString() {
                return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`
            }
        }

        class vi extends Pt {
            constructor(t, n, r, o) {
                super(t, n), this.reason = r, this.code = o, this.type = 2
            }

            toString() {
                return `NavigationCancel(id: ${this.id}, url: '${this.url}')`
            }
        }

        class Zr extends Pt {
            constructor(t, n, r, o) {
                super(t, n), this.reason = r, this.code = o, this.type = 16
            }
        }

        class Pa extends Pt {
            constructor(t, n, r, o) {
                super(t, n), this.error = r, this.target = o, this.type = 3
            }

            toString() {
                return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`
            }
        }

        class Zw extends Pt {
            constructor(t, n, r, o) {
                super(t, n), this.urlAfterRedirects = r, this.state = o, this.type = 4
            }

            toString() {
                return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
            }
        }

        class SF extends Pt {
            constructor(t, n, r, o) {
                super(t, n), this.urlAfterRedirects = r, this.state = o, this.type = 7
            }

            toString() {
                return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
            }
        }

        class MF extends Pt {
            constructor(t, n, r, o, i) {
                super(t, n), this.urlAfterRedirects = r, this.state = o, this.shouldActivate = i, this.type = 8
            }

            toString() {
                return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`
            }
        }

        class TF extends Pt {
            constructor(t, n, r, o) {
                super(t, n), this.urlAfterRedirects = r, this.state = o, this.type = 5
            }

            toString() {
                return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
            }
        }

        class AF extends Pt {
            constructor(t, n, r, o) {
                super(t, n), this.urlAfterRedirects = r, this.state = o, this.type = 6
            }

            toString() {
                return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`
            }
        }

        class NF {
            constructor(t) {
                this.route = t, this.type = 9
            }

            toString() {
                return `RouteConfigLoadStart(path: ${this.route.path})`
            }
        }

        class RF {
            constructor(t) {
                this.route = t, this.type = 10
            }

            toString() {
                return `RouteConfigLoadEnd(path: ${this.route.path})`
            }
        }

        class xF {
            constructor(t) {
                this.snapshot = t, this.type = 11
            }

            toString() {
                return `ChildActivationStart(path: '${this.snapshot.routeConfig && this.snapshot.routeConfig.path || ""}')`
            }
        }

        class OF {
            constructor(t) {
                this.snapshot = t, this.type = 12
            }

            toString() {
                return `ChildActivationEnd(path: '${this.snapshot.routeConfig && this.snapshot.routeConfig.path || ""}')`
            }
        }

        class PF {
            constructor(t) {
                this.snapshot = t, this.type = 13
            }

            toString() {
                return `ActivationStart(path: '${this.snapshot.routeConfig && this.snapshot.routeConfig.path || ""}')`
            }
        }

        class FF {
            constructor(t) {
                this.snapshot = t, this.type = 14
            }

            toString() {
                return `ActivationEnd(path: '${this.snapshot.routeConfig && this.snapshot.routeConfig.path || ""}')`
            }
        }

        class Yw {
            constructor(t, n, r) {
                this.routerEvent = t, this.position = n, this.anchor = r, this.type = 15
            }

            toString() {
                return `Scroll(anchor: '${this.anchor}', position: '${this.position ? `${this.position[0]}, ${this.position[1]}` : null}')`
            }
        }

        class Vd {
        }

        class Bd {
            constructor(t) {
                this.url = t
            }
        }

        class kF {
            constructor() {
                this.outlet = null, this.route = null, this.injector = null, this.children = new yi, this.attachRef = null
            }
        }

        let yi = (() => {
            class e {
                constructor() {
                    this.contexts = new Map
                }

                onChildOutletCreated(n, r) {
                    const o = this.getOrCreateContext(n);
                    o.outlet = r, this.contexts.set(n, o)
                }

                onChildOutletDestroyed(n) {
                    const r = this.getContext(n);
                    r && (r.outlet = null, r.attachRef = null)
                }

                onOutletDeactivated() {
                    const n = this.contexts;
                    return this.contexts = new Map, n
                }

                onOutletReAttached(n) {
                    this.contexts = n
                }

                getOrCreateContext(n) {
                    let r = this.getContext(n);
                    return r || (r = new kF, this.contexts.set(n, r)), r
                }

                getContext(n) {
                    return this.contexts.get(n) || null
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)
                    }
                }
                static {
                    this.\u0275prov = S({token: e, factory: e.\u0275fac, providedIn: "root"})
                }
            }

            return e
        })();

        class Qw {
            constructor(t) {
                this._root = t
            }

            get root() {
                return this._root.value
            }

            parent(t) {
                const n = this.pathFromRoot(t);
                return n.length > 1 ? n[n.length - 2] : null
            }

            children(t) {
                const n = Ud(t, this._root);
                return n ? n.children.map(r => r.value) : []
            }

            firstChild(t) {
                const n = Ud(t, this._root);
                return n && n.children.length > 0 ? n.children[0].value : null
            }

            siblings(t) {
                const n = zd(t, this._root);
                return n.length < 2 ? [] : n[n.length - 2].children.map(o => o.value).filter(o => o !== t)
            }

            pathFromRoot(t) {
                return zd(t, this._root).map(n => n.value)
            }
        }

        function Ud(e, t) {
            if (e === t.value) return t;
            for (const n of t.children) {
                const r = Ud(e, n);
                if (r) return r
            }
            return null
        }

        function zd(e, t) {
            if (e === t.value) return [t];
            for (const n of t.children) {
                const r = zd(e, n);
                if (r.length) return r.unshift(t), r
            }
            return []
        }

        class en {
            constructor(t, n) {
                this.value = t, this.children = n
            }

            toString() {
                return `TreeNode(${this.value})`
            }
        }

        function Yr(e) {
            const t = {};
            return e && e.children.forEach(n => t[n.value.outlet] = n), t
        }

        class Xw extends Qw {
            constructor(t, n) {
                super(t), this.snapshot = n, Gd(this, t)
            }

            toString() {
                return this.snapshot.toString()
            }
        }

        function Jw(e, t) {
            const n = function LF(e, t) {
                    const s = new Fa([], {}, {}, "", {}, L, t, null, {});
                    return new eC("", new en(s, []))
                }(0, t), r = new tt([new di("", {})]), o = new tt({}), i = new tt({}), s = new tt({}), a = new tt(""),
                u = new Qr(r, o, s, a, i, L, t, n.root);
            return u.snapshot = n.root, new Xw(new en(u, []), n)
        }

        class Qr {
            constructor(t, n, r, o, i, s, a, u) {
                this.urlSubject = t, this.paramsSubject = n, this.queryParamsSubject = r, this.fragmentSubject = o, this.dataSubject = i, this.outlet = s, this.component = a, this._futureSnapshot = u, this.title = this.dataSubject?.pipe(q(c => c[li])) ?? A(void 0), this.url = t, this.params = n, this.queryParams = r, this.fragment = o, this.data = i
            }

            get routeConfig() {
                return this._futureSnapshot.routeConfig
            }

            get root() {
                return this._routerState.root
            }

            get parent() {
                return this._routerState.parent(this)
            }

            get firstChild() {
                return this._routerState.firstChild(this)
            }

            get children() {
                return this._routerState.children(this)
            }

            get pathFromRoot() {
                return this._routerState.pathFromRoot(this)
            }

            get paramMap() {
                return this._paramMap || (this._paramMap = this.params.pipe(q(t => qr(t)))), this._paramMap
            }

            get queryParamMap() {
                return this._queryParamMap || (this._queryParamMap = this.queryParams.pipe(q(t => qr(t)))), this._queryParamMap
            }

            toString() {
                return this.snapshot ? this.snapshot.toString() : `Future(${this._futureSnapshot})`
            }
        }

        function Kw(e, t = "emptyOnly") {
            const n = e.pathFromRoot;
            let r = 0;
            if ("always" !== t) for (r = n.length - 1; r >= 1;) {
                const o = n[r], i = n[r - 1];
                if (o.routeConfig && "" === o.routeConfig.path) r--; else {
                    if (i.component) break;
                    r--
                }
            }
            return function jF(e) {
                return e.reduce((t, n) => ({
                    params: {...t.params, ...n.params},
                    data: {...t.data, ...n.data},
                    resolve: {...n.data, ...t.resolve, ...n.routeConfig?.data, ...n._resolvedData}
                }), {params: {}, data: {}, resolve: {}})
            }(n.slice(r))
        }

        class Fa {
            get title() {
                return this.data?.[li]
            }

            constructor(t, n, r, o, i, s, a, u, c) {
                this.url = t, this.params = n, this.queryParams = r, this.fragment = o, this.data = i, this.outlet = s, this.component = a, this.routeConfig = u, this._resolve = c
            }

            get root() {
                return this._routerState.root
            }

            get parent() {
                return this._routerState.parent(this)
            }

            get firstChild() {
                return this._routerState.firstChild(this)
            }

            get children() {
                return this._routerState.children(this)
            }

            get pathFromRoot() {
                return this._routerState.pathFromRoot(this)
            }

            get paramMap() {
                return this._paramMap || (this._paramMap = qr(this.params)), this._paramMap
            }

            get queryParamMap() {
                return this._queryParamMap || (this._queryParamMap = qr(this.queryParams)), this._queryParamMap
            }

            toString() {
                return `Route(url:'${this.url.map(r => r.toString()).join("/")}', path:'${this.routeConfig ? this.routeConfig.path : ""}')`
            }
        }

        class eC extends Qw {
            constructor(t, n) {
                super(n), this.url = t, Gd(this, n)
            }

            toString() {
                return tC(this._root)
            }
        }

        function Gd(e, t) {
            t.value._routerState = e, t.children.forEach(n => Gd(e, n))
        }

        function tC(e) {
            const t = e.children.length > 0 ? ` { ${e.children.map(tC).join(", ")} } ` : "";
            return `${e.value}${t}`
        }

        function qd(e) {
            if (e.snapshot) {
                const t = e.snapshot, n = e._futureSnapshot;
                e.snapshot = n, Ot(t.queryParams, n.queryParams) || e.queryParamsSubject.next(n.queryParams), t.fragment !== n.fragment && e.fragmentSubject.next(n.fragment), Ot(t.params, n.params) || e.paramsSubject.next(n.params), function eF(e, t) {
                    if (e.length !== t.length) return !1;
                    for (let n = 0; n < e.length; ++n) if (!Ot(e[n], t[n])) return !1;
                    return !0
                }(t.url, n.url) || e.urlSubject.next(n.url), Ot(t.data, n.data) || e.dataSubject.next(n.data)
            } else e.snapshot = e._futureSnapshot, e.dataSubject.next(e._futureSnapshot.data)
        }

        function Wd(e, t) {
            const n = Ot(e.params, t.params) && function oF(e, t) {
                return Vn(e, t) && e.every((n, r) => Ot(n.parameters, t[r].parameters))
            }(e.url, t.url);
            return n && !(!e.parent != !t.parent) && (!e.parent || Wd(e.parent, t.parent))
        }

        let nC = (() => {
            class e {
                constructor() {
                    this.activated = null, this._activatedRoute = null, this.name = L, this.activateEvents = new Pe, this.deactivateEvents = new Pe, this.attachEvents = new Pe, this.detachEvents = new Pe, this.parentContexts = I(yi), this.location = I(yt), this.changeDetector = I(Xl), this.environmentInjector = I(Qe), this.inputBinder = I(ka, {optional: !0}), this.supportsBindingToComponentInputs = !0
                }

                get activatedComponentRef() {
                    return this.activated
                }

                ngOnChanges(n) {
                    if (n.name) {
                        const {firstChange: r, previousValue: o} = n.name;
                        if (r) return;
                        this.isTrackedInParentContexts(o) && (this.deactivate(), this.parentContexts.onChildOutletDestroyed(o)), this.initializeOutletWithName()
                    }
                }

                ngOnDestroy() {
                    this.isTrackedInParentContexts(this.name) && this.parentContexts.onChildOutletDestroyed(this.name), this.inputBinder?.unsubscribeFromRouteData(this)
                }

                isTrackedInParentContexts(n) {
                    return this.parentContexts.getContext(n)?.outlet === this
                }

                ngOnInit() {
                    this.initializeOutletWithName()
                }

                initializeOutletWithName() {
                    if (this.parentContexts.onChildOutletCreated(this.name, this), this.activated) return;
                    const n = this.parentContexts.getContext(this.name);
                    n?.route && (n.attachRef ? this.attach(n.attachRef, n.route) : this.activateWith(n.route, n.injector))
                }

                get isActivated() {
                    return !!this.activated
                }

                get component() {
                    if (!this.activated) throw new w(4012, !1);
                    return this.activated.instance
                }

                get activatedRoute() {
                    if (!this.activated) throw new w(4012, !1);
                    return this._activatedRoute
                }

                get activatedRouteData() {
                    return this._activatedRoute ? this._activatedRoute.snapshot.data : {}
                }

                detach() {
                    if (!this.activated) throw new w(4012, !1);
                    this.location.detach();
                    const n = this.activated;
                    return this.activated = null, this._activatedRoute = null, this.detachEvents.emit(n.instance), n
                }

                attach(n, r) {
                    this.activated = n, this._activatedRoute = r, this.location.insert(n.hostView), this.inputBinder?.bindActivatedRouteToOutletComponent(this), this.attachEvents.emit(n.instance)
                }

                deactivate() {
                    if (this.activated) {
                        const n = this.component;
                        this.activated.destroy(), this.activated = null, this._activatedRoute = null, this.deactivateEvents.emit(n)
                    }
                }

                activateWith(n, r) {
                    if (this.isActivated) throw new w(4013, !1);
                    this._activatedRoute = n;
                    const o = this.location, s = n.snapshot.component,
                        a = this.parentContexts.getOrCreateContext(this.name).children, u = new $F(n, a, o.injector);
                    this.activated = o.createComponent(s, {
                        index: o.length,
                        injector: u,
                        environmentInjector: r ?? this.environmentInjector
                    }), this.changeDetector.markForCheck(), this.inputBinder?.bindActivatedRouteToOutletComponent(this), this.activateEvents.emit(this.activated.instance)
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)
                    }
                }
                static {
                    this.\u0275dir = Te({
                        type: e,
                        selectors: [["router-outlet"]],
                        inputs: {name: "name"},
                        outputs: {
                            activateEvents: "activate",
                            deactivateEvents: "deactivate",
                            attachEvents: "attach",
                            detachEvents: "detach"
                        },
                        exportAs: ["outlet"],
                        standalone: !0,
                        features: [Mn]
                    })
                }
            }

            return e
        })();

        class $F {
            constructor(t, n, r) {
                this.route = t, this.childContexts = n, this.parent = r
            }

            get(t, n) {
                return t === Qr ? this.route : t === yi ? this.childContexts : this.parent.get(t, n)
            }
        }

        const ka = new b("");
        let rC = (() => {
            class e {
                constructor() {
                    this.outletDataSubscriptions = new Map
                }

                bindActivatedRouteToOutletComponent(n) {
                    this.unsubscribeFromRouteData(n), this.subscribeToRouteData(n)
                }

                unsubscribeFromRouteData(n) {
                    this.outletDataSubscriptions.get(n)?.unsubscribe(), this.outletDataSubscriptions.delete(n)
                }

                subscribeToRouteData(n) {
                    const {activatedRoute: r} = n,
                        o = xd([r.queryParams, r.params, r.data]).pipe(dt(([i, s, a], u) => (a = {...i, ...s, ...a}, 0 === u ? A(a) : Promise.resolve(a)))).subscribe(i => {
                            if (!n.isActivated || !n.activatedComponentRef || n.activatedRoute !== r || null === r.component) return void this.unsubscribeFromRouteData(n);
                            const s = function ax(e) {
                                const t = V(e);
                                if (!t) return null;
                                const n = new Bo(t);
                                return {
                                    get selector() {
                                        return n.selector
                                    }, get type() {
                                        return n.componentType
                                    }, get inputs() {
                                        return n.inputs
                                    }, get outputs() {
                                        return n.outputs
                                    }, get ngContentSelectors() {
                                        return n.ngContentSelectors
                                    }, get isStandalone() {
                                        return t.standalone
                                    }, get isSignal() {
                                        return t.signals
                                    }
                                }
                            }(r.component);
                            if (s) for (const {templateName: a} of s.inputs) n.activatedComponentRef.setInput(a, i[a]); else this.unsubscribeFromRouteData(n)
                        });
                    this.outletDataSubscriptions.set(n, o)
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)
                    }
                }
                static {
                    this.\u0275prov = S({token: e, factory: e.\u0275fac})
                }
            }

            return e
        })();

        function Di(e, t, n) {
            if (n && e.shouldReuseRoute(t.value, n.value.snapshot)) {
                const r = n.value;
                r._futureSnapshot = t.value;
                const o = function VF(e, t, n) {
                    return t.children.map(r => {
                        for (const o of n.children) if (e.shouldReuseRoute(r.value, o.value.snapshot)) return Di(e, r, o);
                        return Di(e, r)
                    })
                }(e, t, n);
                return new en(r, o)
            }
            {
                if (e.shouldAttach(t.value)) {
                    const i = e.retrieve(t.value);
                    if (null !== i) {
                        const s = i.route;
                        return s.value._futureSnapshot = t.value, s.children = t.children.map(a => Di(e, a)), s
                    }
                }
                const r = function BF(e) {
                    return new Qr(new tt(e.url), new tt(e.params), new tt(e.queryParams), new tt(e.fragment), new tt(e.data), e.outlet, e.component, e)
                }(t.value), o = t.children.map(i => Di(e, i));
                return new en(r, o)
            }
        }

        const Zd = "ngNavigationCancelingError";

        function oC(e, t) {
            const {redirectTo: n, navigationBehaviorOptions: r} = Bn(t) ? {
                redirectTo: t,
                navigationBehaviorOptions: void 0
            } : t, o = iC(!1, 0, t);
            return o.url = n, o.navigationBehaviorOptions = r, o
        }

        function iC(e, t, n) {
            const r = new Error("NavigationCancelingError: " + (e || ""));
            return r[Zd] = !0, r.cancellationCode = t, n && (r.url = n), r
        }

        function sC(e) {
            return e && e[Zd]
        }

        let aC = (() => {
            class e {
                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)
                    }
                }
                static {
                    this.\u0275cmp = Hi({
                        type: e,
                        selectors: [["ng-component"]],
                        standalone: !0,
                        features: [ay],
                        decls: 1,
                        vars: 0,
                        template: function (r, o) {
                            1 & r && qs(0, "router-outlet")
                        },
                        dependencies: [nC],
                        encapsulation: 2
                    })
                }
            }

            return e
        })();

        function Yd(e) {
            const t = e.children && e.children.map(Yd), n = t ? {...e, children: t} : {...e};
            return !n.component && !n.loadComponent && (t || n.loadChildren) && n.outlet && n.outlet !== L && (n.component = aC), n
        }

        function Ct(e) {
            return e.outlet || L
        }

        function wi(e) {
            if (!e) return null;
            if (e.routeConfig?._injector) return e.routeConfig._injector;
            for (let t = e.parent; t; t = t.parent) {
                const n = t.routeConfig;
                if (n?._loadedInjector) return n._loadedInjector;
                if (n?._injector) return n._injector
            }
            return null
        }

        class QF {
            constructor(t, n, r, o, i) {
                this.routeReuseStrategy = t, this.futureState = n, this.currState = r, this.forwardEvent = o, this.inputBindingEnabled = i
            }

            activate(t) {
                const n = this.futureState._root, r = this.currState ? this.currState._root : null;
                this.deactivateChildRoutes(n, r, t), qd(this.futureState.root), this.activateChildRoutes(n, r, t)
            }

            deactivateChildRoutes(t, n, r) {
                const o = Yr(n);
                t.children.forEach(i => {
                    const s = i.value.outlet;
                    this.deactivateRoutes(i, o[s], r), delete o[s]
                }), Object.values(o).forEach(i => {
                    this.deactivateRouteAndItsChildren(i, r)
                })
            }

            deactivateRoutes(t, n, r) {
                const o = t.value, i = n ? n.value : null;
                if (o === i) if (o.component) {
                    const s = r.getContext(o.outlet);
                    s && this.deactivateChildRoutes(t, n, s.children)
                } else this.deactivateChildRoutes(t, n, r); else i && this.deactivateRouteAndItsChildren(n, r)
            }

            deactivateRouteAndItsChildren(t, n) {
                t.value.component && this.routeReuseStrategy.shouldDetach(t.value.snapshot) ? this.detachAndStoreRouteSubtree(t, n) : this.deactivateRouteAndOutlet(t, n)
            }

            detachAndStoreRouteSubtree(t, n) {
                const r = n.getContext(t.value.outlet), o = r && t.value.component ? r.children : n, i = Yr(t);
                for (const s of Object.keys(i)) this.deactivateRouteAndItsChildren(i[s], o);
                if (r && r.outlet) {
                    const s = r.outlet.detach(), a = r.children.onOutletDeactivated();
                    this.routeReuseStrategy.store(t.value.snapshot, {componentRef: s, route: t, contexts: a})
                }
            }

            deactivateRouteAndOutlet(t, n) {
                const r = n.getContext(t.value.outlet), o = r && t.value.component ? r.children : n, i = Yr(t);
                for (const s of Object.keys(i)) this.deactivateRouteAndItsChildren(i[s], o);
                r && (r.outlet && (r.outlet.deactivate(), r.children.onOutletDeactivated()), r.attachRef = null, r.route = null)
            }

            activateChildRoutes(t, n, r) {
                const o = Yr(n);
                t.children.forEach(i => {
                    this.activateRoutes(i, o[i.value.outlet], r), this.forwardEvent(new FF(i.value.snapshot))
                }), t.children.length && this.forwardEvent(new OF(t.value.snapshot))
            }

            activateRoutes(t, n, r) {
                const o = t.value, i = n ? n.value : null;
                if (qd(o), o === i) if (o.component) {
                    const s = r.getOrCreateContext(o.outlet);
                    this.activateChildRoutes(t, n, s.children)
                } else this.activateChildRoutes(t, n, r); else if (o.component) {
                    const s = r.getOrCreateContext(o.outlet);
                    if (this.routeReuseStrategy.shouldAttach(o.snapshot)) {
                        const a = this.routeReuseStrategy.retrieve(o.snapshot);
                        this.routeReuseStrategy.store(o.snapshot, null), s.children.onOutletReAttached(a.contexts), s.attachRef = a.componentRef, s.route = a.route.value, s.outlet && s.outlet.attach(a.componentRef, a.route.value), qd(a.route.value), this.activateChildRoutes(t, null, s.children)
                    } else {
                        const a = wi(o.snapshot);
                        s.attachRef = null, s.route = o, s.injector = a, s.outlet && s.outlet.activateWith(o, s.injector), this.activateChildRoutes(t, null, s.children)
                    }
                } else this.activateChildRoutes(t, null, r)
            }
        }

        class uC {
            constructor(t) {
                this.path = t, this.route = this.path[this.path.length - 1]
            }
        }

        class La {
            constructor(t, n) {
                this.component = t, this.route = n
            }
        }

        function XF(e, t, n) {
            const r = e._root;
            return Ci(r, t ? t._root : null, n, [r.value])
        }

        function Xr(e, t) {
            const n = Symbol(), r = t.get(e, n);
            return r === n ? "function" != typeof e || function aI(e) {
                return null !== Oi(e)
            }(e) ? t.get(e) : e : r
        }

        function Ci(e, t, n, r, o = {canDeactivateChecks: [], canActivateChecks: []}) {
            const i = Yr(t);
            return e.children.forEach(s => {
                (function KF(e, t, n, r, o = {canDeactivateChecks: [], canActivateChecks: []}) {
                    const i = e.value, s = t ? t.value : null, a = n ? n.getContext(e.value.outlet) : null;
                    if (s && i.routeConfig === s.routeConfig) {
                        const u = function e1(e, t, n) {
                            if ("function" == typeof n) return n(e, t);
                            switch (n) {
                                case"pathParamsChange":
                                    return !Vn(e.url, t.url);
                                case"pathParamsOrQueryParamsChange":
                                    return !Vn(e.url, t.url) || !Ot(e.queryParams, t.queryParams);
                                case"always":
                                    return !0;
                                case"paramsOrQueryParamsChange":
                                    return !Wd(e, t) || !Ot(e.queryParams, t.queryParams);
                                default:
                                    return !Wd(e, t)
                            }
                        }(s, i, i.routeConfig.runGuardsAndResolvers);
                        u ? o.canActivateChecks.push(new uC(r)) : (i.data = s.data, i._resolvedData = s._resolvedData), Ci(e, t, i.component ? a ? a.children : null : n, r, o), u && a && a.outlet && a.outlet.isActivated && o.canDeactivateChecks.push(new La(a.outlet.component, s))
                    } else s && Ei(t, a, o), o.canActivateChecks.push(new uC(r)), Ci(e, null, i.component ? a ? a.children : null : n, r, o)
                })(s, i[s.value.outlet], n, r.concat([s.value]), o), delete i[s.value.outlet]
            }), Object.entries(i).forEach(([s, a]) => Ei(a, n.getContext(s), o)), o
        }

        function Ei(e, t, n) {
            const r = Yr(e), o = e.value;
            Object.entries(r).forEach(([i, s]) => {
                Ei(s, o.component ? t ? t.children.getContext(i) : null : t, n)
            }), n.canDeactivateChecks.push(new La(o.component && t && t.outlet && t.outlet.isActivated ? t.outlet.component : null, o))
        }

        function Ii(e) {
            return "function" == typeof e
        }

        function cC(e) {
            return e instanceof _a || "EmptyError" === e?.name
        }

        const ja = Symbol("INITIAL_VALUE");

        function Jr() {
            return dt(e => xd(e.map(t => t.pipe(zr(1), function GP(...e) {
                const t = so(e);
                return fe((n, r) => {
                    (t ? Od(e, n, t) : Od(e, n)).subscribe(r)
                })
            }(ja)))).pipe(q(t => {
                for (const n of t) if (!0 !== n) {
                    if (n === ja) return ja;
                    if (!1 === n || n instanceof Wr) return n
                }
                return !0
            }), Kt(t => t !== ja), zr(1)))
        }

        function lC(e) {
            return function rE(...e) {
                return pf(e)
            }(Me(t => {
                if (Bn(t)) throw oC(0, t)
            }), q(t => !0 === t))
        }

        class $a {
            constructor(t) {
                this.segmentGroup = t || null
            }
        }

        class dC {
            constructor(t) {
                this.urlTree = t
            }
        }

        function Kr(e) {
            return ui(new $a(e))
        }

        function fC(e) {
            return ui(new dC(e))
        }

        class w1 {
            constructor(t, n) {
                this.urlSerializer = t, this.urlTree = n
            }

            noMatchError(t) {
                return new w(4002, !1)
            }

            lineralizeSegments(t, n) {
                let r = [], o = n.root;
                for (; ;) {
                    if (r = r.concat(o.segments), 0 === o.numberOfChildren) return A(r);
                    if (o.numberOfChildren > 1 || !o.children[L]) return ui(new w(4e3, !1));
                    o = o.children[L]
                }
            }

            applyRedirectCommands(t, n, r) {
                return this.applyRedirectCreateUrlTree(n, this.urlSerializer.parse(n), t, r)
            }

            applyRedirectCreateUrlTree(t, n, r, o) {
                const i = this.createSegmentGroup(t, n.root, r, o);
                return new Wr(i, this.createQueryParams(n.queryParams, this.urlTree.queryParams), n.fragment)
            }

            createQueryParams(t, n) {
                const r = {};
                return Object.entries(t).forEach(([o, i]) => {
                    if ("string" == typeof i && i.startsWith(":")) {
                        const a = i.substring(1);
                        r[o] = n[a]
                    } else r[o] = i
                }), r
            }

            createSegmentGroup(t, n, r, o) {
                const i = this.createSegments(t, n.segments, r, o);
                let s = {};
                return Object.entries(n.children).forEach(([a, u]) => {
                    s[a] = this.createSegmentGroup(t, u, r, o)
                }), new Y(i, s)
            }

            createSegments(t, n, r, o) {
                return n.map(i => i.path.startsWith(":") ? this.findPosParam(t, i, o) : this.findOrReturn(i, r))
            }

            findPosParam(t, n, r) {
                const o = r[n.path.substring(1)];
                if (!o) throw new w(4001, !1);
                return o
            }

            findOrReturn(t, n) {
                let r = 0;
                for (const o of n) {
                    if (o.path === t.path) return n.splice(r), o;
                    r++
                }
                return t
            }
        }

        const Qd = {
            matched: !1,
            consumedSegments: [],
            remainingSegments: [],
            parameters: {},
            positionalParamSegments: {}
        };

        function C1(e, t, n, r, o) {
            const i = Xd(e, t, n);
            return i.matched ? (r = function zF(e, t) {
                return e.providers && !e._injector && (e._injector = Ml(e.providers, t, `Route: ${e.path}`)), e._injector ?? t
            }(t, r), function v1(e, t, n, r) {
                const o = t.canMatch;
                return o && 0 !== o.length ? A(o.map(s => {
                    const a = Xr(s, e);
                    return yn(function s1(e) {
                        return e && Ii(e.canMatch)
                    }(a) ? a.canMatch(t, n) : e.runInContext(() => a(t, n)))
                })).pipe(Jr(), lC()) : A(!0)
            }(r, t, n).pipe(q(s => !0 === s ? i : {...Qd}))) : A(i)
        }

        function Xd(e, t, n) {
            if ("" === t.path) return "full" === t.pathMatch && (e.hasChildren() || n.length > 0) ? {...Qd} : {
                matched: !0,
                consumedSegments: [],
                remainingSegments: n,
                parameters: {},
                positionalParamSegments: {}
            };
            const o = (t.matcher || KP)(n, e, t);
            if (!o) return {...Qd};
            const i = {};
            Object.entries(o.posParams ?? {}).forEach(([a, u]) => {
                i[a] = u.path
            });
            const s = o.consumed.length > 0 ? {...i, ...o.consumed[o.consumed.length - 1].parameters} : i;
            return {
                matched: !0,
                consumedSegments: o.consumed,
                remainingSegments: n.slice(o.consumed.length),
                parameters: s,
                positionalParamSegments: o.posParams ?? {}
            }
        }

        function hC(e, t, n, r) {
            return n.length > 0 && function b1(e, t, n) {
                return n.some(r => Ha(e, t, r) && Ct(r) !== L)
            }(e, n, r) ? {
                segmentGroup: new Y(t, I1(r, new Y(n, e.children))),
                slicedSegments: []
            } : 0 === n.length && function _1(e, t, n) {
                return n.some(r => Ha(e, t, r))
            }(e, n, r) ? {
                segmentGroup: new Y(e.segments, E1(e, 0, n, r, e.children)),
                slicedSegments: n
            } : {segmentGroup: new Y(e.segments, e.children), slicedSegments: n}
        }

        function E1(e, t, n, r, o) {
            const i = {};
            for (const s of r) if (Ha(e, n, s) && !o[Ct(s)]) {
                const a = new Y([], {});
                i[Ct(s)] = a
            }
            return {...o, ...i}
        }

        function I1(e, t) {
            const n = {};
            n[L] = t;
            for (const r of e) if ("" === r.path && Ct(r) !== L) {
                const o = new Y([], {});
                n[Ct(r)] = o
            }
            return n
        }

        function Ha(e, t, n) {
            return (!(e.hasChildren() || t.length > 0) || "full" !== n.pathMatch) && "" === n.path
        }

        class A1 {
            constructor(t, n, r, o, i, s, a) {
                this.injector = t, this.configLoader = n, this.rootComponentType = r, this.config = o, this.urlTree = i, this.paramsInheritanceStrategy = s, this.urlSerializer = a, this.allowRedirects = !0, this.applyRedirects = new w1(this.urlSerializer, this.urlTree)
            }

            noMatchError(t) {
                return new w(4002, !1)
            }

            recognize() {
                const t = hC(this.urlTree.root, [], [], this.config).segmentGroup;
                return this.processSegmentGroup(this.injector, this.config, t, L).pipe(Hn(n => {
                    if (n instanceof dC) return this.allowRedirects = !1, this.urlTree = n.urlTree, this.match(n.urlTree);
                    throw n instanceof $a ? this.noMatchError(n) : n
                }), q(n => {
                    const r = new Fa([], Object.freeze({}), Object.freeze({...this.urlTree.queryParams}), this.urlTree.fragment, {}, L, this.rootComponentType, null, {}),
                        o = new en(r, n), i = new eC("", o), s = function DF(e, t, n = null, r = null) {
                            return Bw(Vw(e), t, n, r)
                        }(r, [], this.urlTree.queryParams, this.urlTree.fragment);
                    return s.queryParams = this.urlTree.queryParams, i.url = this.urlSerializer.serialize(s), this.inheritParamsAndData(i._root), {
                        state: i,
                        tree: s
                    }
                }))
            }

            match(t) {
                return this.processSegmentGroup(this.injector, this.config, t.root, L).pipe(Hn(r => {
                    throw r instanceof $a ? this.noMatchError(r) : r
                }))
            }

            inheritParamsAndData(t) {
                const n = t.value, r = Kw(n, this.paramsInheritanceStrategy);
                n.params = Object.freeze(r.params), n.data = Object.freeze(r.data), t.children.forEach(o => this.inheritParamsAndData(o))
            }

            processSegmentGroup(t, n, r, o) {
                return 0 === r.segments.length && r.hasChildren() ? this.processChildren(t, n, r) : this.processSegment(t, n, r, r.segments, o, !0)
            }

            processChildren(t, n, r) {
                const o = [];
                for (const i of Object.keys(r.children)) "primary" === i ? o.unshift(i) : o.push(i);
                return ve(o).pipe(Gr(i => {
                    const s = r.children[i], a = function ZF(e, t) {
                        const n = e.filter(r => Ct(r) === t);
                        return n.push(...e.filter(r => Ct(r) !== t)), n
                    }(n, i);
                    return this.processSegmentGroup(t, a, s, i)
                }), function ZP(e, t) {
                    return fe(function WP(e, t, n, r, o) {
                        return (i, s) => {
                            let a = n, u = t, c = 0;
                            i.subscribe(he(s, l => {
                                const d = c++;
                                u = a ? e(u, l, d) : (a = !0, l), r && s.next(u)
                            }, o && (() => {
                                a && s.next(u), s.complete()
                            })))
                        }
                    }(e, t, arguments.length >= 2, !0))
                }((i, s) => (i.push(...s), i)), Sa(null), function YP(e, t) {
                    const n = arguments.length >= 2;
                    return r => r.pipe(e ? Kt((o, i) => e(o, i, r)) : nn, Fd(1), n ? Sa(t) : Tw(() => new _a))
                }(), De(i => {
                    if (null === i) return Kr(r);
                    const s = pC(i);
                    return function N1(e) {
                        e.sort((t, n) => t.value.outlet === L ? -1 : n.value.outlet === L ? 1 : t.value.outlet.localeCompare(n.value.outlet))
                    }(s), A(s)
                }))
            }

            processSegment(t, n, r, o, i, s) {
                return ve(n).pipe(Gr(a => this.processSegmentAgainstRoute(a._injector ?? t, n, a, r, o, i, s).pipe(Hn(u => {
                    if (u instanceof $a) return A(null);
                    throw u
                }))), $n(a => !!a), Hn(a => {
                    if (cC(a)) return function M1(e, t, n) {
                        return 0 === t.length && !e.children[n]
                    }(r, o, i) ? A([]) : Kr(r);
                    throw a
                }))
            }

            processSegmentAgainstRoute(t, n, r, o, i, s, a) {
                return function S1(e, t, n, r) {
                    return !!(Ct(e) === r || r !== L && Ha(t, n, e)) && ("**" === e.path || Xd(t, e, n).matched)
                }(r, o, i, s) ? void 0 === r.redirectTo ? this.matchSegmentAgainstRoute(t, o, r, i, s, a) : a && this.allowRedirects ? this.expandSegmentAgainstRouteUsingRedirect(t, o, n, r, i, s) : Kr(o) : Kr(o)
            }

            expandSegmentAgainstRouteUsingRedirect(t, n, r, o, i, s) {
                return "**" === o.path ? this.expandWildCardWithParamsAgainstRouteUsingRedirect(t, r, o, s) : this.expandRegularSegmentAgainstRouteUsingRedirect(t, n, r, o, i, s)
            }

            expandWildCardWithParamsAgainstRouteUsingRedirect(t, n, r, o) {
                const i = this.applyRedirects.applyRedirectCommands([], r.redirectTo, {});
                return r.redirectTo.startsWith("/") ? fC(i) : this.applyRedirects.lineralizeSegments(r, i).pipe(De(s => {
                    const a = new Y(s, {});
                    return this.processSegment(t, n, a, s, o, !1)
                }))
            }

            expandRegularSegmentAgainstRouteUsingRedirect(t, n, r, o, i, s) {
                const {matched: a, consumedSegments: u, remainingSegments: c, positionalParamSegments: l} = Xd(n, o, i);
                if (!a) return Kr(n);
                const d = this.applyRedirects.applyRedirectCommands(u, o.redirectTo, l);
                return o.redirectTo.startsWith("/") ? fC(d) : this.applyRedirects.lineralizeSegments(o, d).pipe(De(f => this.processSegment(t, r, n, f.concat(c), s, !1)))
            }

            matchSegmentAgainstRoute(t, n, r, o, i, s) {
                let a;
                if ("**" === r.path) {
                    const u = o.length > 0 ? Nw(o).parameters : {};
                    a = A({
                        snapshot: new Fa(o, u, Object.freeze({...this.urlTree.queryParams}), this.urlTree.fragment, gC(r), Ct(r), r.component ?? r._loadedComponent ?? null, r, mC(r)),
                        consumedSegments: [],
                        remainingSegments: []
                    }), n.children = {}
                } else a = C1(n, r, o, t).pipe(q(({
                                                      matched: u,
                                                      consumedSegments: c,
                                                      remainingSegments: l,
                                                      parameters: d
                                                  }) => u ? {
                    snapshot: new Fa(c, d, Object.freeze({...this.urlTree.queryParams}), this.urlTree.fragment, gC(r), Ct(r), r.component ?? r._loadedComponent ?? null, r, mC(r)),
                    consumedSegments: c,
                    remainingSegments: l
                } : null));
                return a.pipe(dt(u => null === u ? Kr(n) : this.getChildConfig(t = r._injector ?? t, r, o).pipe(dt(({routes: c}) => {
                    const l = r._loadedInjector ?? t, {
                        snapshot: d,
                        consumedSegments: f,
                        remainingSegments: h
                    } = u, {segmentGroup: p, slicedSegments: g} = hC(n, f, h, c);
                    if (0 === g.length && p.hasChildren()) return this.processChildren(l, c, p).pipe(q(D => null === D ? null : [new en(d, D)]));
                    if (0 === c.length && 0 === g.length) return A([new en(d, [])]);
                    const v = Ct(r) === i;
                    return this.processSegment(l, c, p, g, v ? L : i, !0).pipe(q(D => [new en(d, D)]))
                }))))
            }

            getChildConfig(t, n, r) {
                return n.children ? A({
                    routes: n.children,
                    injector: t
                }) : n.loadChildren ? void 0 !== n._loadedRoutes ? A({
                    routes: n._loadedRoutes,
                    injector: n._loadedInjector
                }) : function m1(e, t, n, r) {
                    const o = t.canLoad;
                    return void 0 === o || 0 === o.length ? A(!0) : A(o.map(s => {
                        const a = Xr(s, e);
                        return yn(function n1(e) {
                            return e && Ii(e.canLoad)
                        }(a) ? a.canLoad(t, n) : e.runInContext(() => a(t, n)))
                    })).pipe(Jr(), lC())
                }(t, n, r).pipe(De(o => o ? this.configLoader.loadChildren(t, n).pipe(Me(i => {
                    n._loadedRoutes = i.routes, n._loadedInjector = i.injector
                })) : function D1(e) {
                    return ui(iC(!1, 3))
                }())) : A({routes: [], injector: t})
            }
        }

        function R1(e) {
            const t = e.value.routeConfig;
            return t && "" === t.path
        }

        function pC(e) {
            const t = [], n = new Set;
            for (const r of e) {
                if (!R1(r)) {
                    t.push(r);
                    continue
                }
                const o = t.find(i => r.value.routeConfig === i.value.routeConfig);
                void 0 !== o ? (o.children.push(...r.children), n.add(o)) : t.push(r)
            }
            for (const r of n) {
                const o = pC(r.children);
                t.push(new en(r.value, o))
            }
            return t.filter(r => !n.has(r))
        }

        function gC(e) {
            return e.data || {}
        }

        function mC(e) {
            return e.resolve || {}
        }

        function vC(e) {
            return "string" == typeof e.title || null === e.title
        }

        function Jd(e) {
            return dt(t => {
                const n = e(t);
                return n ? ve(n).pipe(q(() => t)) : A(t)
            })
        }

        const eo = new b("ROUTES");
        let Kd = (() => {
            class e {
                constructor() {
                    this.componentLoaders = new WeakMap, this.childrenLoaders = new WeakMap, this.compiler = I(Ky)
                }

                loadComponent(n) {
                    if (this.componentLoaders.get(n)) return this.componentLoaders.get(n);
                    if (n._loadedComponent) return A(n._loadedComponent);
                    this.onLoadStartListener && this.onLoadStartListener(n);
                    const r = yn(n.loadComponent()).pipe(q(yC), Me(i => {
                        this.onLoadEndListener && this.onLoadEndListener(n), n._loadedComponent = i
                    }), ci(() => {
                        this.componentLoaders.delete(n)
                    })), o = new Mw(r, () => new lt).pipe(Pd());
                    return this.componentLoaders.set(n, o), o
                }

                loadChildren(n, r) {
                    if (this.childrenLoaders.get(r)) return this.childrenLoaders.get(r);
                    if (r._loadedRoutes) return A({routes: r._loadedRoutes, injector: r._loadedInjector});
                    this.onLoadStartListener && this.onLoadStartListener(r);
                    const i = function j1(e, t, n, r) {
                        return yn(e.loadChildren()).pipe(q(yC), De(o => o instanceof iy || Array.isArray(o) ? A(o) : ve(t.compileModuleAsync(o))), q(o => {
                            r && r(e);
                            let i, s, a = !1;
                            return Array.isArray(o) ? (s = o, !0) : (i = o.create(n).injector, s = i.get(eo, [], {
                                optional: !0,
                                self: !0
                            }).flat()), {routes: s.map(Yd), injector: i}
                        }))
                    }(r, this.compiler, n, this.onLoadEndListener).pipe(ci(() => {
                        this.childrenLoaders.delete(r)
                    })), s = new Mw(i, () => new lt).pipe(Pd());
                    return this.childrenLoaders.set(r, s), s
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)
                    }
                }
                static {
                    this.\u0275prov = S({token: e, factory: e.\u0275fac, providedIn: "root"})
                }
            }

            return e
        })();

        function yC(e) {
            return function $1(e) {
                return e && "object" == typeof e && "default" in e
            }(e) ? e.default : e
        }

        let Va = (() => {
            class e {
                get hasRequestedNavigation() {
                    return 0 !== this.navigationId
                }

                constructor() {
                    this.currentNavigation = null, this.currentTransition = null, this.lastSuccessfulNavigation = null, this.events = new lt, this.transitionAbortSubject = new lt, this.configLoader = I(Kd), this.environmentInjector = I(Qe), this.urlSerializer = I(fi), this.rootContexts = I(yi), this.inputBindingEnabled = null !== I(ka, {optional: !0}), this.navigationId = 0, this.afterPreactivation = () => A(void 0), this.rootComponentType = null, this.configLoader.onLoadEndListener = o => this.events.next(new RF(o)), this.configLoader.onLoadStartListener = o => this.events.next(new NF(o))
                }

                complete() {
                    this.transitions?.complete()
                }

                handleNavigationRequest(n) {
                    const r = ++this.navigationId;
                    this.transitions?.next({...this.transitions.value, ...n, id: r})
                }

                setupNavigations(n, r, o) {
                    return this.transitions = new tt({
                        id: 0,
                        currentUrlTree: r,
                        currentRawUrl: r,
                        currentBrowserUrl: r,
                        extractedUrl: n.urlHandlingStrategy.extract(r),
                        urlAfterRedirects: n.urlHandlingStrategy.extract(r),
                        rawUrl: r,
                        extras: {},
                        resolve: null,
                        reject: null,
                        promise: Promise.resolve(!0),
                        source: mi,
                        restoredState: null,
                        currentSnapshot: o.snapshot,
                        targetSnapshot: null,
                        currentRouterState: o,
                        targetRouterState: null,
                        guards: {canActivateChecks: [], canDeactivateChecks: []},
                        guardsResult: null
                    }), this.transitions.pipe(Kt(i => 0 !== i.id), q(i => ({
                        ...i,
                        extractedUrl: n.urlHandlingStrategy.extract(i.rawUrl)
                    })), dt(i => {
                        this.currentTransition = i;
                        let s = !1, a = !1;
                        return A(i).pipe(Me(u => {
                            this.currentNavigation = {
                                id: u.id,
                                initialUrl: u.rawUrl,
                                extractedUrl: u.extractedUrl,
                                trigger: u.source,
                                extras: u.extras,
                                previousNavigation: this.lastSuccessfulNavigation ? {
                                    ...this.lastSuccessfulNavigation,
                                    previousNavigation: null
                                } : null
                            }
                        }), dt(u => {
                            const c = u.currentBrowserUrl.toString(),
                                l = !n.navigated || u.extractedUrl.toString() !== c || c !== u.currentUrlTree.toString();
                            if (!l && "reload" !== (u.extras.onSameUrlNavigation ?? n.onSameUrlNavigation)) {
                                const f = "";
                                return this.events.next(new Zr(u.id, this.urlSerializer.serialize(u.rawUrl), f, 0)), u.resolve(null), Et
                            }
                            if (n.urlHandlingStrategy.shouldProcessUrl(u.rawUrl)) return A(u).pipe(dt(f => {
                                const h = this.transitions?.getValue();
                                return this.events.next(new Oa(f.id, this.urlSerializer.serialize(f.extractedUrl), f.source, f.restoredState)), h !== this.transitions?.getValue() ? Et : Promise.resolve(f)
                            }), function x1(e, t, n, r, o, i) {
                                return De(s => function T1(e, t, n, r, o, i, s = "emptyOnly") {
                                    return new A1(e, t, n, r, o, s, i).recognize()
                                }(e, t, n, r, s.extractedUrl, o, i).pipe(q(({state: a, tree: u}) => ({
                                    ...s,
                                    targetSnapshot: a,
                                    urlAfterRedirects: u
                                }))))
                            }(this.environmentInjector, this.configLoader, this.rootComponentType, n.config, this.urlSerializer, n.paramsInheritanceStrategy), Me(f => {
                                i.targetSnapshot = f.targetSnapshot, i.urlAfterRedirects = f.urlAfterRedirects, this.currentNavigation = {
                                    ...this.currentNavigation,
                                    finalUrl: f.urlAfterRedirects
                                };
                                const h = new Zw(f.id, this.urlSerializer.serialize(f.extractedUrl), this.urlSerializer.serialize(f.urlAfterRedirects), f.targetSnapshot);
                                this.events.next(h)
                            }));
                            if (l && n.urlHandlingStrategy.shouldProcessUrl(u.currentRawUrl)) {
                                const {id: f, extractedUrl: h, source: p, restoredState: g, extras: v} = u,
                                    D = new Oa(f, this.urlSerializer.serialize(h), p, g);
                                this.events.next(D);
                                const m = Jw(0, this.rootComponentType).snapshot;
                                return this.currentTransition = i = {
                                    ...u,
                                    targetSnapshot: m,
                                    urlAfterRedirects: h,
                                    extras: {...v, skipLocationChange: !1, replaceUrl: !1}
                                }, A(i)
                            }
                            {
                                const f = "";
                                return this.events.next(new Zr(u.id, this.urlSerializer.serialize(u.extractedUrl), f, 1)), u.resolve(null), Et
                            }
                        }), Me(u => {
                            const c = new SF(u.id, this.urlSerializer.serialize(u.extractedUrl), this.urlSerializer.serialize(u.urlAfterRedirects), u.targetSnapshot);
                            this.events.next(c)
                        }), q(u => (this.currentTransition = i = {
                            ...u,
                            guards: XF(u.targetSnapshot, u.currentSnapshot, this.rootContexts)
                        }, i)), function u1(e, t) {
                            return De(n => {
                                const {
                                    targetSnapshot: r,
                                    currentSnapshot: o,
                                    guards: {canActivateChecks: i, canDeactivateChecks: s}
                                } = n;
                                return 0 === s.length && 0 === i.length ? A({
                                    ...n,
                                    guardsResult: !0
                                }) : function c1(e, t, n, r) {
                                    return ve(e).pipe(De(o => function g1(e, t, n, r, o) {
                                        const i = t && t.routeConfig ? t.routeConfig.canDeactivate : null;
                                        return i && 0 !== i.length ? A(i.map(a => {
                                            const u = wi(t) ?? o, c = Xr(a, u);
                                            return yn(function i1(e) {
                                                return e && Ii(e.canDeactivate)
                                            }(c) ? c.canDeactivate(e, t, n, r) : u.runInContext(() => c(e, t, n, r))).pipe($n())
                                        })).pipe(Jr()) : A(!0)
                                    }(o.component, o.route, n, t, r)), $n(o => !0 !== o, !0))
                                }(s, r, o, e).pipe(De(a => a && function t1(e) {
                                    return "boolean" == typeof e
                                }(a) ? function l1(e, t, n, r) {
                                    return ve(t).pipe(Gr(o => Od(function f1(e, t) {
                                        return null !== e && t && t(new xF(e)), A(!0)
                                    }(o.route.parent, r), function d1(e, t) {
                                        return null !== e && t && t(new PF(e)), A(!0)
                                    }(o.route, r), function p1(e, t, n) {
                                        const r = t[t.length - 1],
                                            i = t.slice(0, t.length - 1).reverse().map(s => function JF(e) {
                                                const t = e.routeConfig ? e.routeConfig.canActivateChild : null;
                                                return t && 0 !== t.length ? {node: e, guards: t} : null
                                            }(s)).filter(s => null !== s).map(s => Sw(() => A(s.guards.map(u => {
                                                const c = wi(s.node) ?? n, l = Xr(u, c);
                                                return yn(function o1(e) {
                                                    return e && Ii(e.canActivateChild)
                                                }(l) ? l.canActivateChild(r, e) : c.runInContext(() => l(r, e))).pipe($n())
                                            })).pipe(Jr())));
                                        return A(i).pipe(Jr())
                                    }(e, o.path, n), function h1(e, t, n) {
                                        const r = t.routeConfig ? t.routeConfig.canActivate : null;
                                        if (!r || 0 === r.length) return A(!0);
                                        const o = r.map(i => Sw(() => {
                                            const s = wi(t) ?? n, a = Xr(i, s);
                                            return yn(function r1(e) {
                                                return e && Ii(e.canActivate)
                                            }(a) ? a.canActivate(t, e) : s.runInContext(() => a(t, e))).pipe($n())
                                        }));
                                        return A(o).pipe(Jr())
                                    }(e, o.route, n))), $n(o => !0 !== o, !0))
                                }(r, i, e, t) : A(a)), q(a => ({...n, guardsResult: a})))
                            })
                        }(this.environmentInjector, u => this.events.next(u)), Me(u => {
                            if (i.guardsResult = u.guardsResult, Bn(u.guardsResult)) throw oC(0, u.guardsResult);
                            const c = new MF(u.id, this.urlSerializer.serialize(u.extractedUrl), this.urlSerializer.serialize(u.urlAfterRedirects), u.targetSnapshot, !!u.guardsResult);
                            this.events.next(c)
                        }), Kt(u => !!u.guardsResult || (this.cancelNavigationTransition(u, "", 3), !1)), Jd(u => {
                            if (u.guards.canActivateChecks.length) return A(u).pipe(Me(c => {
                                const l = new TF(c.id, this.urlSerializer.serialize(c.extractedUrl), this.urlSerializer.serialize(c.urlAfterRedirects), c.targetSnapshot);
                                this.events.next(l)
                            }), dt(c => {
                                let l = !1;
                                return A(c).pipe(function O1(e, t) {
                                    return De(n => {
                                        const {targetSnapshot: r, guards: {canActivateChecks: o}} = n;
                                        if (!o.length) return A(n);
                                        let i = 0;
                                        return ve(o).pipe(Gr(s => function P1(e, t, n, r) {
                                            const o = e.routeConfig, i = e._resolve;
                                            return void 0 !== o?.title && !vC(o) && (i[li] = o.title), function F1(e, t, n, r) {
                                                const o = function k1(e) {
                                                    return [...Object.keys(e), ...Object.getOwnPropertySymbols(e)]
                                                }(e);
                                                if (0 === o.length) return A({});
                                                const i = {};
                                                return ve(o).pipe(De(s => function L1(e, t, n, r) {
                                                    const o = wi(t) ?? r, i = Xr(e, o);
                                                    return yn(i.resolve ? i.resolve(t, n) : o.runInContext(() => i(t, n)))
                                                }(e[s], t, n, r).pipe($n(), Me(a => {
                                                    i[s] = a
                                                }))), Fd(1), function QP(e) {
                                                    return q(() => e)
                                                }(i), Hn(s => cC(s) ? Et : ui(s)))
                                            }(i, e, t, r).pipe(q(s => (e._resolvedData = s, e.data = Kw(e, n).resolve, o && vC(o) && (e.data[li] = o.title), null)))
                                        }(s.route, r, e, t)), Me(() => i++), Fd(1), De(s => i === o.length ? A(n) : Et))
                                    })
                                }(n.paramsInheritanceStrategy, this.environmentInjector), Me({
                                    next: () => l = !0,
                                    complete: () => {
                                        l || this.cancelNavigationTransition(c, "", 2)
                                    }
                                }))
                            }), Me(c => {
                                const l = new AF(c.id, this.urlSerializer.serialize(c.extractedUrl), this.urlSerializer.serialize(c.urlAfterRedirects), c.targetSnapshot);
                                this.events.next(l)
                            }))
                        }), Jd(u => {
                            const c = l => {
                                const d = [];
                                l.routeConfig?.loadComponent && !l.routeConfig._loadedComponent && d.push(this.configLoader.loadComponent(l.routeConfig).pipe(Me(f => {
                                    l.component = f
                                }), q(() => {
                                })));
                                for (const f of l.children) d.push(...c(f));
                                return d
                            };
                            return xd(c(u.targetSnapshot.root)).pipe(Sa(), zr(1))
                        }), Jd(() => this.afterPreactivation()), q(u => {
                            const c = function HF(e, t, n) {
                                const r = Di(e, t._root, n ? n._root : void 0);
                                return new Xw(r, t)
                            }(n.routeReuseStrategy, u.targetSnapshot, u.currentRouterState);
                            return this.currentTransition = i = {...u, targetRouterState: c}, i
                        }), Me(() => {
                            this.events.next(new Vd)
                        }), ((e, t, n, r) => q(o => (new QF(t, o.targetRouterState, o.currentRouterState, n, r).activate(e), o)))(this.rootContexts, n.routeReuseStrategy, u => this.events.next(u), this.inputBindingEnabled), zr(1), Me({
                            next: u => {
                                s = !0, this.lastSuccessfulNavigation = this.currentNavigation, this.events.next(new Dn(u.id, this.urlSerializer.serialize(u.extractedUrl), this.urlSerializer.serialize(u.urlAfterRedirects))), n.titleStrategy?.updateTitle(u.targetRouterState.snapshot), u.resolve(!0)
                            }, complete: () => {
                                s = !0
                            }
                        }), function XP(e) {
                            return fe((t, n) => {
                                et(e).subscribe(he(n, () => n.complete(), Wa)), !n.closed && t.subscribe(n)
                            })
                        }(this.transitionAbortSubject.pipe(Me(u => {
                            throw u
                        }))), ci(() => {
                            s || a || this.cancelNavigationTransition(i, "", 1), this.currentNavigation?.id === i.id && (this.currentNavigation = null)
                        }), Hn(u => {
                            if (a = !0, sC(u)) this.events.next(new vi(i.id, this.urlSerializer.serialize(i.extractedUrl), u.message, u.cancellationCode)), function UF(e) {
                                return sC(e) && Bn(e.url)
                            }(u) ? this.events.next(new Bd(u.url)) : i.resolve(!1); else {
                                this.events.next(new Pa(i.id, this.urlSerializer.serialize(i.extractedUrl), u, i.targetSnapshot ?? void 0));
                                try {
                                    i.resolve(n.errorHandler(u))
                                } catch (c) {
                                    i.reject(c)
                                }
                            }
                            return Et
                        }))
                    }))
                }

                cancelNavigationTransition(n, r, o) {
                    const i = new vi(n.id, this.urlSerializer.serialize(n.extractedUrl), r, o);
                    this.events.next(i), n.resolve(!1)
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)
                    }
                }
                static {
                    this.\u0275prov = S({token: e, factory: e.\u0275fac, providedIn: "root"})
                }
            }

            return e
        })();

        function DC(e) {
            return e !== mi
        }

        let wC = (() => {
            class e {
                buildTitle(n) {
                    let r, o = n.root;
                    for (; void 0 !== o;) r = this.getResolvedTitleForRoute(o) ?? r, o = o.children.find(i => i.outlet === L);
                    return r
                }

                getResolvedTitleForRoute(n) {
                    return n.data[li]
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)
                    }
                }
                static {
                    this.\u0275prov = S({
                        token: e, factory: function () {
                            return I(H1)
                        }, providedIn: "root"
                    })
                }
            }

            return e
        })(), H1 = (() => {
            class e extends wC {
                constructor(n) {
                    super(), this.title = n
                }

                updateTitle(n) {
                    const r = this.buildTitle(n);
                    void 0 !== r && this.title.setTitle(r)
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)(_(Cw))
                    }
                }
                static {
                    this.\u0275prov = S({token: e, factory: e.\u0275fac, providedIn: "root"})
                }
            }

            return e
        })(), V1 = (() => {
            class e {
                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)
                    }
                }
                static {
                    this.\u0275prov = S({
                        token: e, factory: function () {
                            return I(U1)
                        }, providedIn: "root"
                    })
                }
            }

            return e
        })();

        class B1 {
            shouldDetach(t) {
                return !1
            }

            store(t, n) {
            }

            shouldAttach(t) {
                return !1
            }

            retrieve(t) {
                return null
            }

            shouldReuseRoute(t, n) {
                return t.routeConfig === n.routeConfig
            }
        }

        let U1 = (() => {
            class e extends B1 {
                static {
                    this.\u0275fac = function () {
                        let n;
                        return function (o) {
                            return (n || (n = function rp(e) {
                                return $t(() => {
                                    const t = e.prototype.constructor, n = t[Ht] || Gu(t), r = Object.prototype;
                                    let o = Object.getPrototypeOf(e.prototype).constructor;
                                    for (; o && o !== r;) {
                                        const i = o[Ht] || Gu(o);
                                        if (i && i !== n) return i;
                                        o = Object.getPrototypeOf(o)
                                    }
                                    return i => new i
                                })
                            }(e)))(o || e)
                        }
                    }()
                }
                static {
                    this.\u0275prov = S({token: e, factory: e.\u0275fac, providedIn: "root"})
                }
            }

            return e
        })();
        const Ba = new b("", {providedIn: "root", factory: () => ({})});
        let z1 = (() => {
            class e {
                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)
                    }
                }
                static {
                    this.\u0275prov = S({
                        token: e, factory: function () {
                            return I(G1)
                        }, providedIn: "root"
                    })
                }
            }

            return e
        })(), G1 = (() => {
            class e {
                shouldProcessUrl(n) {
                    return !0
                }

                extract(n) {
                    return n
                }

                merge(n, r) {
                    return n
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)
                    }
                }
                static {
                    this.\u0275prov = S({token: e, factory: e.\u0275fac, providedIn: "root"})
                }
            }

            return e
        })();
        var bi = function (e) {
            return e[e.COMPLETE = 0] = "COMPLETE", e[e.FAILED = 1] = "FAILED", e[e.REDIRECTING = 2] = "REDIRECTING", e
        }(bi || {});

        function CC(e, t) {
            e.events.pipe(Kt(n => n instanceof Dn || n instanceof vi || n instanceof Pa || n instanceof Zr), q(n => n instanceof Dn || n instanceof Zr ? bi.COMPLETE : n instanceof vi && (0 === n.code || 1 === n.code) ? bi.REDIRECTING : bi.FAILED), Kt(n => n !== bi.REDIRECTING), zr(1)).subscribe(() => {
                t()
            })
        }

        function q1(e) {
            throw e
        }

        function W1(e, t, n) {
            return t.parse("/")
        }

        const Z1 = {paths: "exact", fragment: "ignored", matrixParams: "ignored", queryParams: "exact"},
            Y1 = {paths: "subset", fragment: "ignored", matrixParams: "ignored", queryParams: "subset"};
        let ct = (() => {
            class e {
                get navigationId() {
                    return this.navigationTransitions.navigationId
                }

                get browserPageId() {
                    return "computed" !== this.canceledNavigationResolution ? this.currentPageId : this.location.getState()?.\u0275routerPageId ?? this.currentPageId
                }

                get events() {
                    return this._events
                }

                constructor() {
                    this.disposed = !1, this.currentPageId = 0, this.console = I(Jy), this.isNgZoneEnabled = !1, this._events = new lt, this.options = I(Ba, {optional: !0}) || {}, this.pendingTasks = I(oa), this.errorHandler = this.options.errorHandler || q1, this.malformedUriErrorHandler = this.options.malformedUriErrorHandler || W1, this.navigated = !1, this.lastSuccessfulId = -1, this.urlHandlingStrategy = I(z1), this.routeReuseStrategy = I(V1), this.titleStrategy = I(wC), this.onSameUrlNavigation = this.options.onSameUrlNavigation || "ignore", this.paramsInheritanceStrategy = this.options.paramsInheritanceStrategy || "emptyOnly", this.urlUpdateStrategy = this.options.urlUpdateStrategy || "deferred", this.canceledNavigationResolution = this.options.canceledNavigationResolution || "replace", this.config = I(eo, {optional: !0})?.flat() ?? [], this.navigationTransitions = I(Va), this.urlSerializer = I(fi), this.location = I(ad), this.componentInputBindingEnabled = !!I(ka, {optional: !0}), this.eventsSubscription = new Ge, this.isNgZoneEnabled = I(ee) instanceof ee && ee.isInAngularZone(), this.resetConfig(this.config), this.currentUrlTree = new Wr, this.rawUrlTree = this.currentUrlTree, this.browserUrlTree = this.currentUrlTree, this.routerState = Jw(0, null), this.navigationTransitions.setupNavigations(this, this.currentUrlTree, this.routerState).subscribe(n => {
                        this.lastSuccessfulId = n.id, this.currentPageId = this.browserPageId
                    }, n => {
                        this.console.warn(`Unhandled Navigation Error: ${n}`)
                    }), this.subscribeToNavigationEvents()
                }

                subscribeToNavigationEvents() {
                    const n = this.navigationTransitions.events.subscribe(r => {
                        try {
                            const {currentTransition: o} = this.navigationTransitions;
                            if (null === o) return void (EC(r) && this._events.next(r));
                            if (r instanceof Oa) DC(o.source) && (this.browserUrlTree = o.extractedUrl); else if (r instanceof Zr) this.rawUrlTree = o.rawUrl; else if (r instanceof Zw) {
                                if ("eager" === this.urlUpdateStrategy) {
                                    if (!o.extras.skipLocationChange) {
                                        const i = this.urlHandlingStrategy.merge(o.urlAfterRedirects, o.rawUrl);
                                        this.setBrowserUrl(i, o)
                                    }
                                    this.browserUrlTree = o.urlAfterRedirects
                                }
                            } else if (r instanceof Vd) this.currentUrlTree = o.urlAfterRedirects, this.rawUrlTree = this.urlHandlingStrategy.merge(o.urlAfterRedirects, o.rawUrl), this.routerState = o.targetRouterState, "deferred" === this.urlUpdateStrategy && (o.extras.skipLocationChange || this.setBrowserUrl(this.rawUrlTree, o), this.browserUrlTree = o.urlAfterRedirects); else if (r instanceof vi) 0 !== r.code && 1 !== r.code && (this.navigated = !0), (3 === r.code || 2 === r.code) && this.restoreHistory(o); else if (r instanceof Bd) {
                                const i = this.urlHandlingStrategy.merge(r.url, o.currentRawUrl), s = {
                                    skipLocationChange: o.extras.skipLocationChange,
                                    replaceUrl: "eager" === this.urlUpdateStrategy || DC(o.source)
                                };
                                this.scheduleNavigation(i, mi, null, s, {
                                    resolve: o.resolve,
                                    reject: o.reject,
                                    promise: o.promise
                                })
                            }
                            r instanceof Pa && this.restoreHistory(o, !0), r instanceof Dn && (this.navigated = !0), EC(r) && this._events.next(r)
                        } catch (o) {
                            this.navigationTransitions.transitionAbortSubject.next(o)
                        }
                    });
                    this.eventsSubscription.add(n)
                }

                resetRootComponentType(n) {
                    this.routerState.root.component = n, this.navigationTransitions.rootComponentType = n
                }

                initialNavigation() {
                    if (this.setUpLocationChangeListener(), !this.navigationTransitions.hasRequestedNavigation) {
                        const n = this.location.getState();
                        this.navigateToSyncWithBrowser(this.location.path(!0), mi, n)
                    }
                }

                setUpLocationChangeListener() {
                    this.locationSubscription || (this.locationSubscription = this.location.subscribe(n => {
                        const r = "popstate" === n.type ? "popstate" : "hashchange";
                        "popstate" === r && setTimeout(() => {
                            this.navigateToSyncWithBrowser(n.url, r, n.state)
                        }, 0)
                    }))
                }

                navigateToSyncWithBrowser(n, r, o) {
                    const i = {replaceUrl: !0}, s = o?.navigationId ? o : null;
                    if (o) {
                        const u = {...o};
                        delete u.navigationId, delete u.\u0275routerPageId, 0 !== Object.keys(u).length && (i.state = u)
                    }
                    const a = this.parseUrl(n);
                    this.scheduleNavigation(a, r, s, i)
                }

                get url() {
                    return this.serializeUrl(this.currentUrlTree)
                }

                getCurrentNavigation() {
                    return this.navigationTransitions.currentNavigation
                }

                get lastSuccessfulNavigation() {
                    return this.navigationTransitions.lastSuccessfulNavigation
                }

                resetConfig(n) {
                    this.config = n.map(Yd), this.navigated = !1, this.lastSuccessfulId = -1
                }

                ngOnDestroy() {
                    this.dispose()
                }

                dispose() {
                    this.navigationTransitions.complete(), this.locationSubscription && (this.locationSubscription.unsubscribe(), this.locationSubscription = void 0), this.disposed = !0, this.eventsSubscription.unsubscribe()
                }

                createUrlTree(n, r = {}) {
                    const {relativeTo: o, queryParams: i, fragment: s, queryParamsHandling: a, preserveFragment: u} = r,
                        c = u ? this.currentUrlTree.fragment : s;
                    let d, l = null;
                    switch (a) {
                        case"merge":
                            l = {...this.currentUrlTree.queryParams, ...i};
                            break;
                        case"preserve":
                            l = this.currentUrlTree.queryParams;
                            break;
                        default:
                            l = i || null
                    }
                    null !== l && (l = this.removeEmptyProps(l));
                    try {
                        d = Vw(o ? o.snapshot : this.routerState.snapshot.root)
                    } catch {
                        ("string" != typeof n[0] || !n[0].startsWith("/")) && (n = []), d = this.currentUrlTree.root
                    }
                    return Bw(d, n, l, c ?? null)
                }

                navigateByUrl(n, r = {skipLocationChange: !1}) {
                    const o = Bn(n) ? n : this.parseUrl(n), i = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
                    return this.scheduleNavigation(i, mi, null, r)
                }

                navigate(n, r = {skipLocationChange: !1}) {
                    return function Q1(e) {
                        for (let t = 0; t < e.length; t++) if (null == e[t]) throw new w(4008, !1)
                    }(n), this.navigateByUrl(this.createUrlTree(n, r), r)
                }

                serializeUrl(n) {
                    return this.urlSerializer.serialize(n)
                }

                parseUrl(n) {
                    let r;
                    try {
                        r = this.urlSerializer.parse(n)
                    } catch (o) {
                        r = this.malformedUriErrorHandler(o, this.urlSerializer, n)
                    }
                    return r
                }

                isActive(n, r) {
                    let o;
                    if (o = !0 === r ? {...Z1} : !1 === r ? {...Y1} : r, Bn(n)) return xw(this.currentUrlTree, n, o);
                    const i = this.parseUrl(n);
                    return xw(this.currentUrlTree, i, o)
                }

                removeEmptyProps(n) {
                    return Object.keys(n).reduce((r, o) => {
                        const i = n[o];
                        return null != i && (r[o] = i), r
                    }, {})
                }

                scheduleNavigation(n, r, o, i, s) {
                    if (this.disposed) return Promise.resolve(!1);
                    let a, u, c;
                    s ? (a = s.resolve, u = s.reject, c = s.promise) : c = new Promise((d, f) => {
                        a = d, u = f
                    });
                    const l = this.pendingTasks.add();
                    return CC(this, () => {
                        queueMicrotask(() => this.pendingTasks.remove(l))
                    }), this.navigationTransitions.handleNavigationRequest({
                        source: r,
                        restoredState: o,
                        currentUrlTree: this.currentUrlTree,
                        currentRawUrl: this.currentUrlTree,
                        currentBrowserUrl: this.browserUrlTree,
                        rawUrl: n,
                        extras: i,
                        resolve: a,
                        reject: u,
                        promise: c,
                        currentSnapshot: this.routerState.snapshot,
                        currentRouterState: this.routerState
                    }), c.catch(d => Promise.reject(d))
                }

                setBrowserUrl(n, r) {
                    const o = this.urlSerializer.serialize(n);
                    if (this.location.isCurrentPathEqualTo(o) || r.extras.replaceUrl) {
                        const s = {...r.extras.state, ...this.generateNgRouterState(r.id, this.browserPageId)};
                        this.location.replaceState(o, "", s)
                    } else {
                        const i = {...r.extras.state, ...this.generateNgRouterState(r.id, this.browserPageId + 1)};
                        this.location.go(o, "", i)
                    }
                }

                restoreHistory(n, r = !1) {
                    if ("computed" === this.canceledNavigationResolution) {
                        const i = this.currentPageId - this.browserPageId;
                        0 !== i ? this.location.historyGo(i) : this.currentUrlTree === this.getCurrentNavigation()?.finalUrl && 0 === i && (this.resetState(n), this.browserUrlTree = n.currentUrlTree, this.resetUrlToCurrentUrlTree())
                    } else "replace" === this.canceledNavigationResolution && (r && this.resetState(n), this.resetUrlToCurrentUrlTree())
                }

                resetState(n) {
                    this.routerState = n.currentRouterState, this.currentUrlTree = n.currentUrlTree, this.rawUrlTree = this.urlHandlingStrategy.merge(this.currentUrlTree, n.rawUrl)
                }

                resetUrlToCurrentUrlTree() {
                    this.location.replaceState(this.urlSerializer.serialize(this.rawUrlTree), "", this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId))
                }

                generateNgRouterState(n, r) {
                    return "computed" === this.canceledNavigationResolution ? {
                        navigationId: n,
                        \u0275routerPageId: r
                    } : {navigationId: n}
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)
                    }
                }
                static {
                    this.\u0275prov = S({token: e, factory: e.\u0275fac, providedIn: "root"})
                }
            }

            return e
        })();

        function EC(e) {
            return !(e instanceof Vd || e instanceof Bd)
        }

        class IC {
        }

        let K1 = (() => {
            class e {
                constructor(n, r, o, i, s) {
                    this.router = n, this.injector = o, this.preloadingStrategy = i, this.loader = s
                }

                setUpPreloading() {
                    this.subscription = this.router.events.pipe(Kt(n => n instanceof Dn), Gr(() => this.preload())).subscribe(() => {
                    })
                }

                preload() {
                    return this.processRoutes(this.injector, this.router.config)
                }

                ngOnDestroy() {
                    this.subscription && this.subscription.unsubscribe()
                }

                processRoutes(n, r) {
                    const o = [];
                    for (const i of r) {
                        i.providers && !i._injector && (i._injector = Ml(i.providers, n, `Route: ${i.path}`));
                        const s = i._injector ?? n, a = i._loadedInjector ?? s;
                        (i.loadChildren && !i._loadedRoutes && void 0 === i.canLoad || i.loadComponent && !i._loadedComponent) && o.push(this.preloadConfig(s, i)), (i.children || i._loadedRoutes) && o.push(this.processRoutes(a, i.children ?? i._loadedRoutes))
                    }
                    return ve(o).pipe(Gn())
                }

                preloadConfig(n, r) {
                    return this.preloadingStrategy.preload(r, () => {
                        let o;
                        o = r.loadChildren && void 0 === r.canLoad ? this.loader.loadChildren(n, r) : A(null);
                        const i = o.pipe(De(s => null === s ? A(void 0) : (r._loadedRoutes = s.routes, r._loadedInjector = s.injector, this.processRoutes(s.injector ?? n, s.routes))));
                        return r.loadComponent && !r._loadedComponent ? ve([i, this.loader.loadComponent(r)]).pipe(Gn()) : i
                    })
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)(_(ct), _(Ky), _(Qe), _(IC), _(Kd))
                    }
                }
                static {
                    this.\u0275prov = S({token: e, factory: e.\u0275fac, providedIn: "root"})
                }
            }

            return e
        })();
        const tf = new b("");
        let bC = (() => {
            class e {
                constructor(n, r, o, i, s = {}) {
                    this.urlSerializer = n, this.transitions = r, this.viewportScroller = o, this.zone = i, this.options = s, this.lastId = 0, this.lastSource = "imperative", this.restoredId = 0, this.store = {}, s.scrollPositionRestoration = s.scrollPositionRestoration || "disabled", s.anchorScrolling = s.anchorScrolling || "disabled"
                }

                init() {
                    "disabled" !== this.options.scrollPositionRestoration && this.viewportScroller.setHistoryScrollRestoration("manual"), this.routerEventsSubscription = this.createScrollEvents(), this.scrollEventsSubscription = this.consumeScrollEvents()
                }

                createScrollEvents() {
                    return this.transitions.events.subscribe(n => {
                        n instanceof Oa ? (this.store[this.lastId] = this.viewportScroller.getScrollPosition(), this.lastSource = n.navigationTrigger, this.restoredId = n.restoredState ? n.restoredState.navigationId : 0) : n instanceof Dn ? (this.lastId = n.id, this.scheduleScrollEvent(n, this.urlSerializer.parse(n.urlAfterRedirects).fragment)) : n instanceof Zr && 0 === n.code && (this.lastSource = void 0, this.restoredId = 0, this.scheduleScrollEvent(n, this.urlSerializer.parse(n.url).fragment))
                    })
                }

                consumeScrollEvents() {
                    return this.transitions.events.subscribe(n => {
                        n instanceof Yw && (n.position ? "top" === this.options.scrollPositionRestoration ? this.viewportScroller.scrollToPosition([0, 0]) : "enabled" === this.options.scrollPositionRestoration && this.viewportScroller.scrollToPosition(n.position) : n.anchor && "enabled" === this.options.anchorScrolling ? this.viewportScroller.scrollToAnchor(n.anchor) : "disabled" !== this.options.scrollPositionRestoration && this.viewportScroller.scrollToPosition([0, 0]))
                    })
                }

                scheduleScrollEvent(n, r) {
                    this.zone.runOutsideAngular(() => {
                        setTimeout(() => {
                            this.zone.run(() => {
                                this.transitions.events.next(new Yw(n, "popstate" === this.lastSource ? this.store[this.restoredId] : null, r))
                            })
                        }, 0)
                    })
                }

                ngOnDestroy() {
                    this.routerEventsSubscription?.unsubscribe(), this.scrollEventsSubscription?.unsubscribe()
                }

                static {
                    this.\u0275fac = function (r) {
                        !function Bg() {
                            throw new Error("invalid")
                        }()
                    }
                }
                static {
                    this.\u0275prov = S({token: e, factory: e.\u0275fac})
                }
            }

            return e
        })();

        function tn(e, t) {
            return {\u0275kind: e, \u0275providers: t}
        }

        function SC() {
            const e = I(it);
            return t => {
                const n = e.get(Vr);
                if (t !== n.components[0]) return;
                const r = e.get(ct), o = e.get(MC);
                1 === e.get(nf) && r.initialNavigation(), e.get(TC, null, $.Optional)?.setUpPreloading(), e.get(tf, null, $.Optional)?.init(), r.resetRootComponentType(n.componentTypes[0]), o.closed || (o.next(), o.complete(), o.unsubscribe())
            }
        }

        const MC = new b("", {factory: () => new lt}), nf = new b("", {providedIn: "root", factory: () => 1}),
            TC = new b("");

        function rk(e) {
            return tn(0, [{provide: TC, useExisting: K1}, {provide: IC, useExisting: e}])
        }

        const AC = new b("ROUTER_FORROOT_GUARD"), ik = [ad, {provide: fi, useClass: kd}, ct, yi, {
            provide: Qr, useFactory: function _C(e) {
                return e.routerState.root
            }, deps: [ct]
        }, Kd, []];

        function sk() {
            return new sD("Router", ct)
        }

        let NC = (() => {
            class e {
                constructor(n) {
                }

                static forRoot(n, r) {
                    return {
                        ngModule: e,
                        providers: [ik, [], {provide: eo, multi: !0, useValue: n}, {
                            provide: AC,
                            useFactory: lk,
                            deps: [[ct, new os, new is]]
                        }, {provide: Ba, useValue: r || {}}, r?.useHash ? {provide: jn, useClass: fx} : {
                            provide: jn,
                            useClass: LD
                        }, {
                            provide: tf, useFactory: () => {
                                const e = I(xO), t = I(ee), n = I(Ba), r = I(Va), o = I(fi);
                                return n.scrollOffset && e.setOffset(n.scrollOffset), new bC(o, r, e, t, n)
                            }
                        }, r?.preloadingStrategy ? rk(r.preloadingStrategy).\u0275providers : [], {
                            provide: sD,
                            multi: !0,
                            useFactory: sk
                        }, r?.initialNavigation ? dk(r) : [], r?.bindToComponentInputs ? tn(8, [rC, {
                            provide: ka,
                            useExisting: rC
                        }]).\u0275providers : [], [{provide: RC, useFactory: SC}, {
                            provide: Yl,
                            multi: !0,
                            useExisting: RC
                        }]]
                    }
                }

                static forChild(n) {
                    return {ngModule: e, providers: [{provide: eo, multi: !0, useValue: n}]}
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)(_(AC, 8))
                    }
                }
                static {
                    this.\u0275mod = sn({type: e})
                }
                static {
                    this.\u0275inj = jt({})
                }
            }

            return e
        })();

        function lk(e) {
            return "guarded"
        }

        function dk(e) {
            return ["disabled" === e.initialNavigation ? tn(3, [{
                provide: Vl, multi: !0, useFactory: () => {
                    const t = I(ct);
                    return () => {
                        t.setUpLocationChangeListener()
                    }
                }
            }, {
                provide: nf,
                useValue: 2
            }]).\u0275providers : [], "enabledBlocking" === e.initialNavigation ? tn(2, [{
                provide: nf,
                useValue: 0
            }, {
                provide: Vl, multi: !0, deps: [it], useFactory: t => {
                    const n = t.get(lx, Promise.resolve());
                    return () => n.then(() => new Promise(r => {
                        const o = t.get(ct), i = t.get(MC);
                        CC(o, () => {
                            r(!0)
                        }), t.get(Va).afterPreactivation = () => (r(!0), i.closed ? A(void 0) : i), o.initialNavigation()
                    }))
                }
            }]).\u0275providers : []]
        }

        const RC = new b(""), hk = [];
        let pk = (() => {
            class e {
                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)
                    }
                }
                static {
                    this.\u0275mod = sn({type: e})
                }
                static {
                    this.\u0275inj = jt({imports: [NC.forRoot(hk), NC]})
                }
            }

            return e
        })();

        class Ua {
        }

        class za {
        }

        class Ft {
            constructor(t) {
                this.normalizedNames = new Map, this.lazyUpdate = null, t ? "string" == typeof t ? this.lazyInit = () => {
                    this.headers = new Map, t.split("\n").forEach(n => {
                        const r = n.indexOf(":");
                        if (r > 0) {
                            const o = n.slice(0, r), i = o.toLowerCase(), s = n.slice(r + 1).trim();
                            this.maybeSetNormalizedName(o, i), this.headers.has(i) ? this.headers.get(i).push(s) : this.headers.set(i, [s])
                        }
                    })
                } : typeof Headers < "u" && t instanceof Headers ? (this.headers = new Map, t.forEach((n, r) => {
                    this.setHeaderEntries(r, n)
                })) : this.lazyInit = () => {
                    this.headers = new Map, Object.entries(t).forEach(([n, r]) => {
                        this.setHeaderEntries(n, r)
                    })
                } : this.headers = new Map
            }

            has(t) {
                return this.init(), this.headers.has(t.toLowerCase())
            }

            get(t) {
                this.init();
                const n = this.headers.get(t.toLowerCase());
                return n && n.length > 0 ? n[0] : null
            }

            keys() {
                return this.init(), Array.from(this.normalizedNames.values())
            }

            getAll(t) {
                return this.init(), this.headers.get(t.toLowerCase()) || null
            }

            append(t, n) {
                return this.clone({name: t, value: n, op: "a"})
            }

            set(t, n) {
                return this.clone({name: t, value: n, op: "s"})
            }

            delete(t, n) {
                return this.clone({name: t, value: n, op: "d"})
            }

            maybeSetNormalizedName(t, n) {
                this.normalizedNames.has(n) || this.normalizedNames.set(n, t)
            }

            init() {
                this.lazyInit && (this.lazyInit instanceof Ft ? this.copyFrom(this.lazyInit) : this.lazyInit(), this.lazyInit = null, this.lazyUpdate && (this.lazyUpdate.forEach(t => this.applyUpdate(t)), this.lazyUpdate = null))
            }

            copyFrom(t) {
                t.init(), Array.from(t.headers.keys()).forEach(n => {
                    this.headers.set(n, t.headers.get(n)), this.normalizedNames.set(n, t.normalizedNames.get(n))
                })
            }

            clone(t) {
                const n = new Ft;
                return n.lazyInit = this.lazyInit && this.lazyInit instanceof Ft ? this.lazyInit : this, n.lazyUpdate = (this.lazyUpdate || []).concat([t]), n
            }

            applyUpdate(t) {
                const n = t.name.toLowerCase();
                switch (t.op) {
                    case"a":
                    case"s":
                        let r = t.value;
                        if ("string" == typeof r && (r = [r]), 0 === r.length) return;
                        this.maybeSetNormalizedName(t.name, n);
                        const o = ("a" === t.op ? this.headers.get(n) : void 0) || [];
                        o.push(...r), this.headers.set(n, o);
                        break;
                    case"d":
                        const i = t.value;
                        if (i) {
                            let s = this.headers.get(n);
                            if (!s) return;
                            s = s.filter(a => -1 === i.indexOf(a)), 0 === s.length ? (this.headers.delete(n), this.normalizedNames.delete(n)) : this.headers.set(n, s)
                        } else this.headers.delete(n), this.normalizedNames.delete(n)
                }
            }

            setHeaderEntries(t, n) {
                const r = (Array.isArray(n) ? n : [n]).map(i => i.toString()), o = t.toLowerCase();
                this.headers.set(o, r), this.maybeSetNormalizedName(t, o)
            }

            forEach(t) {
                this.init(), Array.from(this.normalizedNames.keys()).forEach(n => t(this.normalizedNames.get(n), this.headers.get(n)))
            }
        }

        class gk {
            encodeKey(t) {
                return xC(t)
            }

            encodeValue(t) {
                return xC(t)
            }

            decodeKey(t) {
                return decodeURIComponent(t)
            }

            decodeValue(t) {
                return decodeURIComponent(t)
            }
        }

        const vk = /%(\d[a-f0-9])/gi,
            yk = {40: "@", "3A": ":", 24: "$", "2C": ",", "3B": ";", "3D": "=", "3F": "?", "2F": "/"};

        function xC(e) {
            return encodeURIComponent(e).replace(vk, (t, n) => yk[n] ?? t)
        }

        function Ga(e) {
            return `${e}`
        }

        class wn {
            constructor(t = {}) {
                if (this.updates = null, this.cloneFrom = null, this.encoder = t.encoder || new gk, t.fromString) {
                    if (t.fromObject) throw new Error("Cannot specify both fromString and fromObject.");
                    this.map = function mk(e, t) {
                        const n = new Map;
                        return e.length > 0 && e.replace(/^\?/, "").split("&").forEach(o => {
                            const i = o.indexOf("="), [s, a] = -1 == i ? [t.decodeKey(o), ""] : [t.decodeKey(o.slice(0, i)), t.decodeValue(o.slice(i + 1))],
                                u = n.get(s) || [];
                            u.push(a), n.set(s, u)
                        }), n
                    }(t.fromString, this.encoder)
                } else t.fromObject ? (this.map = new Map, Object.keys(t.fromObject).forEach(n => {
                    const r = t.fromObject[n], o = Array.isArray(r) ? r.map(Ga) : [Ga(r)];
                    this.map.set(n, o)
                })) : this.map = null
            }

            has(t) {
                return this.init(), this.map.has(t)
            }

            get(t) {
                this.init();
                const n = this.map.get(t);
                return n ? n[0] : null
            }

            getAll(t) {
                return this.init(), this.map.get(t) || null
            }

            keys() {
                return this.init(), Array.from(this.map.keys())
            }

            append(t, n) {
                return this.clone({param: t, value: n, op: "a"})
            }

            appendAll(t) {
                const n = [];
                return Object.keys(t).forEach(r => {
                    const o = t[r];
                    Array.isArray(o) ? o.forEach(i => {
                        n.push({param: r, value: i, op: "a"})
                    }) : n.push({param: r, value: o, op: "a"})
                }), this.clone(n)
            }

            set(t, n) {
                return this.clone({param: t, value: n, op: "s"})
            }

            delete(t, n) {
                return this.clone({param: t, value: n, op: "d"})
            }

            toString() {
                return this.init(), this.keys().map(t => {
                    const n = this.encoder.encodeKey(t);
                    return this.map.get(t).map(r => n + "=" + this.encoder.encodeValue(r)).join("&")
                }).filter(t => "" !== t).join("&")
            }

            clone(t) {
                const n = new wn({encoder: this.encoder});
                return n.cloneFrom = this.cloneFrom || this, n.updates = (this.updates || []).concat(t), n
            }

            init() {
                null === this.map && (this.map = new Map), null !== this.cloneFrom && (this.cloneFrom.init(), this.cloneFrom.keys().forEach(t => this.map.set(t, this.cloneFrom.map.get(t))), this.updates.forEach(t => {
                    switch (t.op) {
                        case"a":
                        case"s":
                            const n = ("a" === t.op ? this.map.get(t.param) : void 0) || [];
                            n.push(Ga(t.value)), this.map.set(t.param, n);
                            break;
                        case"d":
                            if (void 0 === t.value) {
                                this.map.delete(t.param);
                                break
                            }
                        {
                            let r = this.map.get(t.param) || [];
                            const o = r.indexOf(Ga(t.value));
                            -1 !== o && r.splice(o, 1), r.length > 0 ? this.map.set(t.param, r) : this.map.delete(t.param)
                        }
                    }
                }), this.cloneFrom = this.updates = null)
            }
        }

        class Dk {
            constructor() {
                this.map = new Map
            }

            set(t, n) {
                return this.map.set(t, n), this
            }

            get(t) {
                return this.map.has(t) || this.map.set(t, t.defaultValue()), this.map.get(t)
            }

            delete(t) {
                return this.map.delete(t), this
            }

            has(t) {
                return this.map.has(t)
            }

            keys() {
                return this.map.keys()
            }
        }

        function OC(e) {
            return typeof ArrayBuffer < "u" && e instanceof ArrayBuffer
        }

        function PC(e) {
            return typeof Blob < "u" && e instanceof Blob
        }

        function FC(e) {
            return typeof FormData < "u" && e instanceof FormData
        }

        class _i {
            constructor(t, n, r, o) {
                let i;
                if (this.url = n, this.body = null, this.reportProgress = !1, this.withCredentials = !1, this.responseType = "json", this.method = t.toUpperCase(), function wk(e) {
                    switch (e) {
                        case"DELETE":
                        case"GET":
                        case"HEAD":
                        case"OPTIONS":
                        case"JSONP":
                            return !1;
                        default:
                            return !0
                    }
                }(this.method) || o ? (this.body = void 0 !== r ? r : null, i = o) : i = r, i && (this.reportProgress = !!i.reportProgress, this.withCredentials = !!i.withCredentials, i.responseType && (this.responseType = i.responseType), i.headers && (this.headers = i.headers), i.context && (this.context = i.context), i.params && (this.params = i.params)), this.headers || (this.headers = new Ft), this.context || (this.context = new Dk), this.params) {
                    const s = this.params.toString();
                    if (0 === s.length) this.urlWithParams = n; else {
                        const a = n.indexOf("?");
                        this.urlWithParams = n + (-1 === a ? "?" : a < n.length - 1 ? "&" : "") + s
                    }
                } else this.params = new wn, this.urlWithParams = n
            }

            serializeBody() {
                return null === this.body ? null : OC(this.body) || PC(this.body) || FC(this.body) || function Ck(e) {
                    return typeof URLSearchParams < "u" && e instanceof URLSearchParams
                }(this.body) || "string" == typeof this.body ? this.body : this.body instanceof wn ? this.body.toString() : "object" == typeof this.body || "boolean" == typeof this.body || Array.isArray(this.body) ? JSON.stringify(this.body) : this.body.toString()
            }

            detectContentTypeHeader() {
                return null === this.body || FC(this.body) ? null : PC(this.body) ? this.body.type || null : OC(this.body) ? null : "string" == typeof this.body ? "text/plain" : this.body instanceof wn ? "application/x-www-form-urlencoded;charset=UTF-8" : "object" == typeof this.body || "number" == typeof this.body || "boolean" == typeof this.body ? "application/json" : null
            }

            clone(t = {}) {
                const n = t.method || this.method, r = t.url || this.url, o = t.responseType || this.responseType,
                    i = void 0 !== t.body ? t.body : this.body,
                    s = void 0 !== t.withCredentials ? t.withCredentials : this.withCredentials,
                    a = void 0 !== t.reportProgress ? t.reportProgress : this.reportProgress;
                let u = t.headers || this.headers, c = t.params || this.params;
                const l = t.context ?? this.context;
                return void 0 !== t.setHeaders && (u = Object.keys(t.setHeaders).reduce((d, f) => d.set(f, t.setHeaders[f]), u)), t.setParams && (c = Object.keys(t.setParams).reduce((d, f) => d.set(f, t.setParams[f]), c)), new _i(n, r, i, {
                    params: c,
                    headers: u,
                    context: l,
                    reportProgress: a,
                    responseType: o,
                    withCredentials: s
                })
            }
        }

        var to = function (e) {
            return e[e.Sent = 0] = "Sent", e[e.UploadProgress = 1] = "UploadProgress", e[e.ResponseHeader = 2] = "ResponseHeader", e[e.DownloadProgress = 3] = "DownloadProgress", e[e.Response = 4] = "Response", e[e.User = 5] = "User", e
        }(to || {});

        class rf {
            constructor(t, n = 200, r = "OK") {
                this.headers = t.headers || new Ft, this.status = void 0 !== t.status ? t.status : n, this.statusText = t.statusText || r, this.url = t.url || null, this.ok = this.status >= 200 && this.status < 300
            }
        }

        class sf extends rf {
            constructor(t = {}) {
                super(t), this.type = to.ResponseHeader
            }

            clone(t = {}) {
                return new sf({
                    headers: t.headers || this.headers,
                    status: void 0 !== t.status ? t.status : this.status,
                    statusText: t.statusText || this.statusText,
                    url: t.url || this.url || void 0
                })
            }
        }

        class no extends rf {
            constructor(t = {}) {
                super(t), this.type = to.Response, this.body = void 0 !== t.body ? t.body : null
            }

            clone(t = {}) {
                return new no({
                    body: void 0 !== t.body ? t.body : this.body,
                    headers: t.headers || this.headers,
                    status: void 0 !== t.status ? t.status : this.status,
                    statusText: t.statusText || this.statusText,
                    url: t.url || this.url || void 0
                })
            }
        }

        class kC extends rf {
            constructor(t) {
                super(t, 0, "Unknown Error"), this.name = "HttpErrorResponse", this.ok = !1, this.message = this.status >= 200 && this.status < 300 ? `Http failure during parsing for ${t.url || "(unknown url)"}` : `Http failure response for ${t.url || "(unknown url)"}: ${t.status} ${t.statusText}`, this.error = t.error || null
            }
        }

        function af(e, t) {
            return {
                body: t,
                headers: e.headers,
                context: e.context,
                observe: e.observe,
                params: e.params,
                reportProgress: e.reportProgress,
                responseType: e.responseType,
                withCredentials: e.withCredentials
            }
        }

        let LC = (() => {
            class e {
                constructor(n) {
                    this.handler = n
                }

                request(n, r, o = {}) {
                    let i;
                    if (n instanceof _i) i = n; else {
                        let u, c;
                        u = o.headers instanceof Ft ? o.headers : new Ft(o.headers), o.params && (c = o.params instanceof wn ? o.params : new wn({fromObject: o.params})), i = new _i(n, r, void 0 !== o.body ? o.body : null, {
                            headers: u,
                            context: o.context,
                            params: c,
                            reportProgress: o.reportProgress,
                            responseType: o.responseType || "json",
                            withCredentials: o.withCredentials
                        })
                    }
                    const s = A(i).pipe(Gr(u => this.handler.handle(u)));
                    if (n instanceof _i || "events" === o.observe) return s;
                    const a = s.pipe(Kt(u => u instanceof no));
                    switch (o.observe || "body") {
                        case"body":
                            switch (i.responseType) {
                                case"arraybuffer":
                                    return a.pipe(q(u => {
                                        if (null !== u.body && !(u.body instanceof ArrayBuffer)) throw new Error("Response is not an ArrayBuffer.");
                                        return u.body
                                    }));
                                case"blob":
                                    return a.pipe(q(u => {
                                        if (null !== u.body && !(u.body instanceof Blob)) throw new Error("Response is not a Blob.");
                                        return u.body
                                    }));
                                case"text":
                                    return a.pipe(q(u => {
                                        if (null !== u.body && "string" != typeof u.body) throw new Error("Response is not a string.");
                                        return u.body
                                    }));
                                default:
                                    return a.pipe(q(u => u.body))
                            }
                        case"response":
                            return a;
                        default:
                            throw new Error(`Unreachable: unhandled observe type ${o.observe}}`)
                    }
                }

                delete(n, r = {}) {
                    return this.request("DELETE", n, r)
                }

                get(n, r = {}) {
                    return this.request("GET", n, r)
                }

                head(n, r = {}) {
                    return this.request("HEAD", n, r)
                }

                jsonp(n, r) {
                    return this.request("JSONP", n, {
                        params: (new wn).append(r, "JSONP_CALLBACK"),
                        observe: "body",
                        responseType: "json"
                    })
                }

                options(n, r = {}) {
                    return this.request("OPTIONS", n, r)
                }

                patch(n, r, o = {}) {
                    return this.request("PATCH", n, af(o, r))
                }

                post(n, r, o = {}) {
                    return this.request("POST", n, af(o, r))
                }

                put(n, r, o = {}) {
                    return this.request("PUT", n, af(o, r))
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)(_(Ua))
                    }
                }
                static {
                    this.\u0275prov = S({token: e, factory: e.\u0275fac})
                }
            }

            return e
        })();

        function HC(e, t) {
            return t(e)
        }

        function Ik(e, t) {
            return (n, r) => t.intercept(n, {handle: o => e(o, r)})
        }

        const _k = new b(""), Si = new b(""), VC = new b("");

        function Sk() {
            let e = null;
            return (t, n) => {
                null === e && (e = (I(_k, {optional: !0}) ?? []).reduceRight(Ik, HC));
                const r = I(oa), o = r.add();
                return e(t, n).pipe(ci(() => r.remove(o)))
            }
        }

        let BC = (() => {
            class e extends Ua {
                constructor(n, r) {
                    super(), this.backend = n, this.injector = r, this.chain = null, this.pendingTasks = I(oa)
                }

                handle(n) {
                    if (null === this.chain) {
                        const o = Array.from(new Set([...this.injector.get(Si), ...this.injector.get(VC, [])]));
                        this.chain = o.reduceRight((i, s) => function bk(e, t, n) {
                            return (r, o) => n.runInContext(() => t(r, i => e(i, o)))
                        }(i, s, this.injector), HC)
                    }
                    const r = this.pendingTasks.add();
                    return this.chain(n, o => this.backend.handle(o)).pipe(ci(() => this.pendingTasks.remove(r)))
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)(_(za), _(Qe))
                    }
                }
                static {
                    this.\u0275prov = S({token: e, factory: e.\u0275fac})
                }
            }

            return e
        })();
        const Nk = /^\)\]\}',?\n/;
        let zC = (() => {
            class e {
                constructor(n) {
                    this.xhrFactory = n
                }

                handle(n) {
                    if ("JSONP" === n.method) throw new w(-2800, !1);
                    const r = this.xhrFactory;
                    return (r.\u0275loadImpl ? ve(r.\u0275loadImpl()) : A(null)).pipe(dt(() => new le(i => {
                        const s = r.build();
                        if (s.open(n.method, n.urlWithParams), n.withCredentials && (s.withCredentials = !0), n.headers.forEach((g, v) => s.setRequestHeader(g, v.join(","))), n.headers.has("Accept") || s.setRequestHeader("Accept", "application/json, text/plain, */*"), !n.headers.has("Content-Type")) {
                            const g = n.detectContentTypeHeader();
                            null !== g && s.setRequestHeader("Content-Type", g)
                        }
                        if (n.responseType) {
                            const g = n.responseType.toLowerCase();
                            s.responseType = "json" !== g ? g : "text"
                        }
                        const a = n.serializeBody();
                        let u = null;
                        const c = () => {
                            if (null !== u) return u;
                            const g = s.statusText || "OK", v = new Ft(s.getAllResponseHeaders()), D = function Rk(e) {
                                return "responseURL" in e && e.responseURL ? e.responseURL : /^X-Request-URL:/m.test(e.getAllResponseHeaders()) ? e.getResponseHeader("X-Request-URL") : null
                            }(s) || n.url;
                            return u = new sf({headers: v, status: s.status, statusText: g, url: D}), u
                        }, l = () => {
                            let {headers: g, status: v, statusText: D, url: m} = c(), E = null;
                            204 !== v && (E = typeof s.response > "u" ? s.responseText : s.response), 0 === v && (v = E ? 200 : 0);
                            let M = v >= 200 && v < 300;
                            if ("json" === n.responseType && "string" == typeof E) {
                                const j = E;
                                E = E.replace(Nk, "");
                                try {
                                    E = "" !== E ? JSON.parse(E) : null
                                } catch (ye) {
                                    E = j, M && (M = !1, E = {error: ye, text: E})
                                }
                            }
                            M ? (i.next(new no({
                                body: E,
                                headers: g,
                                status: v,
                                statusText: D,
                                url: m || void 0
                            })), i.complete()) : i.error(new kC({
                                error: E,
                                headers: g,
                                status: v,
                                statusText: D,
                                url: m || void 0
                            }))
                        }, d = g => {
                            const {url: v} = c(), D = new kC({
                                error: g,
                                status: s.status || 0,
                                statusText: s.statusText || "Unknown Error",
                                url: v || void 0
                            });
                            i.error(D)
                        };
                        let f = !1;
                        const h = g => {
                            f || (i.next(c()), f = !0);
                            let v = {type: to.DownloadProgress, loaded: g.loaded};
                            g.lengthComputable && (v.total = g.total), "text" === n.responseType && s.responseText && (v.partialText = s.responseText), i.next(v)
                        }, p = g => {
                            let v = {type: to.UploadProgress, loaded: g.loaded};
                            g.lengthComputable && (v.total = g.total), i.next(v)
                        };
                        return s.addEventListener("load", l), s.addEventListener("error", d), s.addEventListener("timeout", d), s.addEventListener("abort", d), n.reportProgress && (s.addEventListener("progress", h), null !== a && s.upload && s.upload.addEventListener("progress", p)), s.send(a), i.next({type: to.Sent}), () => {
                            s.removeEventListener("error", d), s.removeEventListener("abort", d), s.removeEventListener("load", l), s.removeEventListener("timeout", d), n.reportProgress && (s.removeEventListener("progress", h), null !== a && s.upload && s.upload.removeEventListener("progress", p)), s.readyState !== s.DONE && s.abort()
                        }
                    })))
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)(_(rw))
                    }
                }
                static {
                    this.\u0275prov = S({token: e, factory: e.\u0275fac})
                }
            }

            return e
        })();
        const uf = new b("XSRF_ENABLED"),
            GC = new b("XSRF_COOKIE_NAME", {providedIn: "root", factory: () => "XSRF-TOKEN"}),
            qC = new b("XSRF_HEADER_NAME", {providedIn: "root", factory: () => "X-XSRF-TOKEN"});

        class WC {
        }

        let Pk = (() => {
            class e {
                constructor(n, r, o) {
                    this.doc = n, this.platform = r, this.cookieName = o, this.lastCookieString = "", this.lastToken = null, this.parseCount = 0
                }

                getToken() {
                    if ("server" === this.platform) return null;
                    const n = this.doc.cookie || "";
                    return n !== this.lastCookieString && (this.parseCount++, this.lastToken = WD(n, this.cookieName), this.lastCookieString = n), this.lastToken
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)(_(Je), _(xn), _(GC))
                    }
                }
                static {
                    this.\u0275prov = S({token: e, factory: e.\u0275fac})
                }
            }

            return e
        })();

        function Fk(e, t) {
            const n = e.url.toLowerCase();
            if (!I(uf) || "GET" === e.method || "HEAD" === e.method || n.startsWith("http://") || n.startsWith("https://")) return t(e);
            const r = I(WC).getToken(), o = I(qC);
            return null != r && !e.headers.has(o) && (e = e.clone({headers: e.headers.set(o, r)})), t(e)
        }

        var Cn = function (e) {
            return e[e.Interceptors = 0] = "Interceptors", e[e.LegacyInterceptors = 1] = "LegacyInterceptors", e[e.CustomXsrfConfiguration = 2] = "CustomXsrfConfiguration", e[e.NoXsrfProtection = 3] = "NoXsrfProtection", e[e.JsonpSupport = 4] = "JsonpSupport", e[e.RequestsMadeViaParent = 5] = "RequestsMadeViaParent", e[e.Fetch = 6] = "Fetch", e
        }(Cn || {});

        function Un(e, t) {
            return {\u0275kind: e, \u0275providers: t}
        }

        function kk(...e) {
            const t = [LC, zC, BC, {provide: Ua, useExisting: BC}, {provide: za, useExisting: zC}, {
                provide: Si,
                useValue: Fk,
                multi: !0
            }, {provide: uf, useValue: !0}, {provide: WC, useClass: Pk}];
            for (const n of e) t.push(...n.\u0275providers);
            return function yc(e) {
                return {\u0275providers: e}
            }(t)
        }

        const ZC = new b("LEGACY_INTERCEPTOR_FN");
        let jk = (() => {
            class e {
                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)
                    }
                }
                static {
                    this.\u0275mod = sn({type: e})
                }
                static {
                    this.\u0275inj = jt({
                        providers: [kk(Un(Cn.LegacyInterceptors, [{
                            provide: ZC,
                            useFactory: Sk
                        }, {provide: Si, useExisting: ZC, multi: !0}]))]
                    })
                }
            }

            return e
        })(), zk = (() => {
            class e {
                constructor(n) {
                    this.http = n, this.apiUrl = "http://localhost:3000/notify"
                }

                getNotification() {
                    return this.http.get(this.apiUrl)
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)(_(LC))
                    }
                }
                static {
                    this.\u0275prov = S({token: e, factory: e.\u0275fac, providedIn: "root"})
                }
            }

            return e
        })();

        function Gk(e, t) {
            if (1 & e && (Pr(0, "div")(1, "h1"), Qs(2, "New Notification"), Fr(), Pr(3, "p"), Qs(4), Fr()()), 2 & e) {
                const n = Hm();
                Bc(4), vl(n.notification)
            }
        }

        let qk = (() => {
            class e {
                constructor(n) {
                    this.notificationService = n, this.notification = "initial"
                }

                ngOnInit() {
                    this.fetchNotification()
                }

                fetchNotification() {
                    this.notificationService.getNotification().subscribe(n => {
                        this.notification = n.headLine, console.log("Received notification:", this.notification)
                    })
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)(T(zk))
                    }
                }
                static {
                    this.\u0275cmp = Hi({
                        type: e,
                        selectors: [["app-notification"]],
                        decls: 3,
                        vars: 1,
                        consts: [[4, "ngIf"]],
                        template: function (r, o) {
                            1 & r && (Pr(0, "h1"), Qs(1, "notification service at play"), Fr(), function Am(e, t, n, r, o, i, s, a) {
                                const u = y(), c = B(), l = e + H,
                                    d = c.firstCreatePass ? function N0(e, t, n, r, o, i, s, a, u) {
                                        const c = t.consts, l = br(t, e, 4, s || null, ln(c, a));
                                        Zc(t, n, l, ln(c, u)), Zi(t, l);
                                        const d = l.tView = Wc(2, l, r, o, i, t.directiveRegistry, t.pipeRegistry, null, t.schemas, c, null);
                                        return null !== t.queries && (t.queries.template(t, l), d.queries = t.queries.embeddedTView(l)), l
                                    }(l, c, u, t, n, r, o, i, s) : c.data[l];
                                Mt(d, !1);
                                const f = Nm(c, u, d, e);
                                Wi() && ms(c, u, f, d), _e(f, u), Ls(u, u[l] = Xg(f, u, f, d)), Ui(d) && Gc(c, u, d), null != s && qc(u, d, a)
                            }(2, Gk, 5, 1, "div", 0)), 2 & r && (Bc(2), al("ngIf", o.notification))
                        },
                        dependencies: [XD]
                    })
                }
            }

            return e
        })(), Wk = (() => {
            class e {
                constructor() {
                    this.title = "ui"
                }

                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)
                    }
                }
                static {
                    this.\u0275cmp = Hi({
                        type: e,
                        selectors: [["app-root"]],
                        decls: 1,
                        vars: 0,
                        template: function (r, o) {
                            1 & r && qs(0, "app-notification")
                        },
                        dependencies: [qk]
                    })
                }
            }

            return e
        })(), Zk = (() => {
            class e {
                static {
                    this.\u0275fac = function (r) {
                        return new (r || e)
                    }
                }
                static {
                    this.\u0275mod = sn({type: e, bootstrap: [Wk]})
                }
                static {
                    this.\u0275inj = jt({imports: [_P, pk, jk]})
                }
            }

            return e
        })();
        IP().bootstrapModule(Zk).catch(e => console.error(e))
    }
}, Q => {
    Q(Q.s = 837)
}]);