(function(e, t) {
    var n, r = 0,
        i = {},
        s = {},
        o = Array.prototype.slice,
        u = function(t) {
            return e.isArray(t) ? t : [t]
        },
        a = "id",
        f = "form",
        l = "click",
        c = "submit",
        h = "disabled",
        p = "wizard",
        d = "default",
        v = "number",
        m = "object",
        g = "string",
        y = "boolean",
        b = "afterBackward",
        w = "afterDestroy",
        E = "afterForward",
        S = "afterSelect",
        x = "beforeBackward",
        T = "beforeDestroy",
        N = "beforeForward",
        C = "beforeSelect",
        k = "beforeSubmit";
    e.each("branch form header step wrapper".split(" "), function() {
        i[this] = "." + (s[this] = p + "-" + this)
    });
    e.widget("kf." + p, {
        version: "1.0.0",
        options: {
            animations: {
                show: {
                    options: {
                        duration: 0
                    },
                    properties: {
                        opacity: "show"
                    }
                },
                hide: {
                    options: {
                        duration: 0
                    },
                    properties: {
                        opacity: "hide"
                    }
                }
            },
            backward: ".backward",
            branches: ".branch",
            disabled: false,
            enableSubmit: false,
            forward: ".forward",
            header: ":header:first",
            initialStep: 0,
            stateAttribute: "data-state",
            stepClasses: {
                current: "current",
                exclude: "exclude",
                stop: "stop",
                submit: "submit",
                unidirectional: "unidirectional"
            },
            steps: ".step",
            submit: ":submit",
            transitions: {},
            unidirectional: false,
            afterBackward: null,
            afterDestroy: null,
            afterForward: null,
            afterSelect: null,
            beforeBackward: null,
            beforeDestroy: null,
            beforeForward: null,
            beforeSelect: null,
            create: null
        },
        _create: function() {
            var t, n, o = this,
                l = o.options,
                c = o.element,
                h = c.find(l.steps),
                v = h.eq(0).parent();
            if (c[0].elements) {
                t = c
            } else if (!(t = c.find(f)).length) {
                t = c.closest(f)
            }
            if (!(n = c.find(l.header)).length) {
                n = t.find(l.header)
            }
            o.elements = {
                form: t.addClass(s.form),
                submit: t.find(l.submit),
                forward: t.find(l.forward),
                backward: t.find(l.backward),
                header: n.addClass(s.header),
                steps: c.find(l.steps).hide().addClass(s.step),
                branches: c.find(l.branches).add(v).addClass(s.branch),
                stepsWrapper: v.addClass(s.wrapper),
                wizard: c.addClass(p)
            };
            if (!v.attr(a)) {
                v.attr(a, p + "-" + ++r)
            }
            o.elements.forward.click(function(e) {
                e.preventDefault();
                o.forward(e)
            });
            o.elements.backward.click(function(e) {
                e.preventDefault();
                o.backward(e)
            });
            o._currentState = {
                branchesActivated: [],
                stepsActivated: []
            };
            o._stepCount = o.elements.steps.length;
            o._lastStepIndex = o._stepCount - 1;
            o._branchLabels = [];
            o.elements.steps.each(function(t) {
                o._branchLabels[t] = e(this).parent().attr(a)
            });
            o._excludesFilter = function() {
                return !e(this).hasClass(l.stepClasses.exclude)
            };
            if (!l.transitions[d]) {
                l.transitions[d] = function(e) {
                    return o.stepIndex(e.nextAll(i.step))
                }
            }
            o.select.apply(o, u(l.initialStep))
        },
        _fastForward: function(n, r, i) {
            var s = 0,
                o = this,
                u = o._currentState.stepIndex,
                a = [u];
            if (e.isFunction(r)) {
                i = r;
                r = t
            }(function f() {
                o._transition(u, function(t, l) {
                    if ((u = o.stepIndex(t, l)) === -1) {
                        throw new Error('[_fastForward]: Invalid step "' + t + '"')
                    } else if (e.inArray(u, a) >= 0) {
                        throw new Error('[_fastForward]: Recursion detected on step "' + t + '"')
                    } else {
                        a.push(u);
                        if (u === o._lastStepIndex || (r ? ++s : u) === n) {
                            i.call(o, u, a)
                        } else {
                            f()
                        }
                    }
                })
            })()
        },
        _find: function(t, n, r) {
            function h(e, t) {
                if (t === a) {
                    i = t;
                    return false
                }
            }
            var i, s, o, a, f, l = [],
                c = n instanceof jQuery ? n : e(n);
            if (t !== null && c.length) {
                t = u(t);
                for (s = 0, o = t.length; s < o; s++) {
                    i = null;
                    a = t[s];
                    f = typeof a;
                    if (f === v) {
                        i = c.get(a)
                    } else if (f === g) {
                        i = document.getElementById(a.replace("#", ""))
                    } else if (f === m) {
                        if (a instanceof jQuery && a.length) {
                            a = a[0]
                        }
                        if (a.nodeType) {
                            c.each(h)
                        }
                    }
                    if (i) {
                        l.push(i)
                    }
                }
            }
            return r === false ? l : e(l)
        },
        _move: function(n, r, i, s, o) {
            function f(n, r) {
                o.call(u, n, e.isArray(s) ? s : s !== false ? r : t)
            }
            var u = this,
                a = u._currentState;
            if (typeof r === y) {
                o = s;
                s = i;
                i = r;
                r = t
            }
            if (i === true) {
                if (n > 0) {
                    u._fastForward(n, i, f)
                } else {
                    o.call(u, a.stepsActivated[Math.max(0, n + (a.stepsActivated.length - 1))])
                }
            } else if ((n = u.stepIndex(n, r)) !== -1) {
                if (n > a.stepIndex) {
                    u._fastForward(n, f)
                } else {
                    f.call(u, n)
                }
            }
        },
        _state: function(t, n) {
            if (!this.isValidStepIndex(t)) {
                return null
            }
            var r = this.options,
                s = e.extend(true, {}, this._currentState);
            n = u(n || t);
            s.step = this.elements.steps.eq(t);
            s.branch = s.step.parent();
            s.branchStepCount = s.branch.children(i.step).length;
            s.isMovingForward = t > s.stepIndex;
            s.stepIndexInBranch = s.branch.children(i.step).index(s.step);
            var o, a, f, l = 0,
                c = n.length;
            for (; l < c; l++) {
                t = n[l];
                o = this._branchLabels[t];
                if (!s.stepIndex || s.stepIndex < t) {
                    if (e.inArray(t, s.stepsActivated) < 0) {
                        s.stepsActivated.push(t);
                        if (e.inArray(o, s.branchesActivated) < 0) {
                            s.branchesActivated.push(o)
                        }
                    }
                } else if (s.stepIndex > t) {
                    a = e.inArray(o, s.branchesActivated) + 1;
                    f = e.inArray(t, s.stepsActivated) + 1;
                    if (a > 0) {
                        s.branchesActivated.splice(a, s.branchesActivated.length - 1)
                    }
                    if (f > 0) {
                        s.stepsActivated.splice(f, s.stepsActivated.length - 1)
                    }
                }
                s.stepIndex = t;
                s.branchLabel = o
            }
            s.stepsComplete = Math.max(0, this._find(s.stepsActivated, this.elements.steps).filter(this._excludesFilter).length - 1);
            s.stepsPossible = Math.max(0, this._find(s.branchesActivated, this.elements.branches).children(i.step).filter(this._excludesFilter).length - 1);
            e.extend(s, {
                branchLabel: this._branchLabels[t],
                isFirstStep: t === 0,
                isFirstStepInBranch: s.stepIndexInBranch === 0,
                isLastStep: t === this._lastStepIndex,
                isLastStepInBranch: s.stepIndexInBranch === s.branchStepCount - 1,
                percentComplete: 100 * s.stepsComplete / s.stepsPossible,
                stepsRemaining: s.stepsPossible - s.stepsComplete
            });
            return s
        },
        _transition: function(n, r, i) {
            var s = this;
            if (e.isFunction(n)) {
                i = n;
                n = s._currentState.stepIndex;
                r = t
            } else if (e.isFunction(r)) {
                i = r;
                r = t
            }
            var a, f = s.options,
                l = s.step(n, r),
                c = l.attr(f.stateAttribute),
                h = c ? f.transitions[c] : f.transitions[d];
            if (e.isFunction(h)) {
                a = h.call(s, l, function() {
                    return i.apply(s, o.call(arguments))
                })
            } else {
                a = c
            }
            if (a !== t && a !== false) {
                i.apply(s, u(a))
            }
            return a
        },
        _update: function(t, n) {
            var r = this._currentState,
                i = this.options;
            if (r.step) {
                if (i.disabled || !n || n.stepIndex === r.stepIndex || !this._trigger(C, t, n) || n.isMovingForward && !this._trigger(N, t, n) || !n.isMovingForward && !this._trigger(x, t, n)) {
                    return
                }
                r.step.removeClass(i.stepClasses.current).animate(i.animations.hide.properties, e.extend({}, i.animations.hide.options))
            }
            this._currentState = n;
            n.step.addClass(i.stepClasses.current).animate(i.animations.show.properties, e.extend({}, i.animations.show.options));
            if (n.isFirstStep || i.unidirectional || n.step.hasClass(i.stepClasses.unidirectional)) {
                this.elements.backward.attr(h, true)
            } else {
                this.elements.backward.removeAttr(h)
            }
            if (n.isLastStepInBranch && !n.step.attr(i.stateAttribute) || n.step.hasClass(i.stepClasses.stop)) {
                this.elements.forward.attr(h, true)
            } else {
                this.elements.forward.removeAttr(h)
            }
            if (i.enableSubmit || n.step.hasClass(i.stepClasses.submit)) {
                this.elements.submit.removeAttr(h)
            } else {
                this.elements.submit.attr(h, true)
            }
            if (r.step) {
                this._trigger(S, t, n);
                this._trigger(n.isMovingForward ? E : b, t, n)
            }
        },
        backward: function(e, n) {
            if (typeof e === v) {
                n = e;
                e = t
            }
            if (n === t) {
                n = 1
            }
            if (this._currentState.isFirstStep || typeof n !== v) {
                return
            }
            this._move(-n, true, false, function(t, n) {
                this._update(e, this._state(t, n))
            })
        },
        branch: function(e) {
            return arguments.length ? this._find(e, this.elements.branches) : this._currentState.branch
        },
        branches: function(e) {
            return arguments.length ? this.branch(e).children(i.branch) : this.elements.branches
        },
        branchesActivated: function() {
            return this._find(this._currentState.branchesActivated, this.elements.branches)
        },
        destroy: function() {
            var t = this.elements;
            if (!this._trigger(T, null, this.state())) {
                return
            }
            this.element.removeClass(p);
            t.form.removeClass(s.form);
            t.header.removeClass(s.header);
            t.steps.show().removeClass(s.step);
            t.stepsWrapper.removeClass(s.wrapper);
            t.branches.removeClass(s.branch);
            e.Widget.prototype.destroy.call(this);
            this._trigger(w)
        },
        form: function() {
            return this.elements.form
        },
        forward: function(e, n, r) {
            if (typeof e === v) {
                r = n;
                n = e;
                e = t
            }
            if (n === t) {
                n = 1
            }
            if (this._currentState.isLastStep || typeof n !== v) {
                return
            }
            this._move(n, true, r, function(t, n) {
                this._update(e, this._state(t, n))
            })
        },
        isValidStep: function(e, t) {
            return this.isValidStepIndex(this.stepIndex(e, t))
        },
        isValidStepIndex: function(e) {
            return typeof e === v && e >= 0 && e <= this._lastStepIndex
        },
        stepCount: function() {
            return this._stepCount
        },
        select: function(n, r, i, s, o) {
            if (!(n instanceof e.Event)) {
                o = s;
                s = i;
                i = r;
                r = n;
                n = t
            }
            if (r === t) {
                return
            }
            if (e.isArray(r)) {
                o = s;
                s = i;
                i = r[1];
                r = r[0]
            } else if (typeof i === y) {
                o = s;
                s = i;
                i = t
            } else if (e.isArray(i)) {
                o = i;
                i = t
            }
            this._move(r, i, s, o, function(e, t) {
                this._update(n, this._state(e, t))
            })
        },
        state: function(n, r, i) {
            if (!arguments.length) {
                return this._currentState
            }
            if (e.isArray(n)) {
                i = r;
                r = n[1];
                n = n[0]
            } else if (e.isArray(r)) {
                i = r;
                r = t
            }
            return this._state(this.stepIndex(n, r), i)
        },
        step: function(n, r) {
            if (!arguments.length) {
                return this._currentState.step
            }
            if (e.isArray(n)) {
                r = n[1];
                n = n[0]
            }
            var i, o = typeof n;
            if (o === v) {
                i = this._find(n, r !== t ? this.steps(r) : this.elements.steps)
            } else {
                i = this._find(n, this.elements.steps.add(this.elements.branches));
                if (i && i.hasClass(s.branch)) {
                    i = this._find(r || 0, this.steps(i))
                }
            }
            return i
        },
        stepIndex: function(n, r, s) {
            if (!arguments.length) {
                return this._currentState.stepIndex
            }
            var o;
            if (e.isArray(n)) {
                s = r;
                r = n[1];
                n = n[0]
            } else if (typeof r === y) {
                s = r;
                r = t
            }
            return (o = this.step(n, r)) ? (s ? o.siblings(i.step).andSelf() : this.elements.steps).index(o) : -1
        },
        steps: function(e) {
            return arguments.length ? this.branch(e).children(i.step) : this.elements.steps
        },
        stepsActivated: function() {
            return this._find(this._currentState.stepsActivated, this.elements.steps)
        },
        submit: function() {
            this.elements.form.submit()
        }
    })
})(jQuery)