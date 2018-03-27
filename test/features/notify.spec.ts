import { fork } from 'child_process'
import { expect, assert } from 'chai'
import 'mocha'
import SpecUtils from '../fixtures/utils'
import { NotifyFeature } from '../../src/features/notify'

describe('Notify', () => {
  describe('notify', () => {
    it('should send a notification', (done) => {
      const child = fork(SpecUtils.buildTestPath('fixtures/features/notifyChild.js'))
      child.on('message', msg => {
        expect(msg).to.equal('test')
        done()
      })
    })

    it('should send a notification for specific level', (done) => {
      const child = fork(SpecUtils.buildTestPath('fixtures/features/notifyChildLevel.js'))
      let count = 0
      child.on('message', msg => {
        count++

        if (msg === 'info') {
          assert.fail()
        } else {
          expect(msg === 'warn' || msg === 'error' || msg === 'does not exist').to.equal(true)
        }

        if (count === 3) {
          done()
        }
      })
    })

    it('should return if argument is not an error', () => {
      const notify = new NotifyFeature()
      notify.init().then(() => {
        const msg = 'test' as any
        const res = notify.notify(msg)
        expect(res).to.equal(-1)
      })
    })
  })

  describe('catchAll', () => {
    it('should catch exception', (done) => {
      const child = fork(SpecUtils.buildTestPath('fixtures/features/catchAllChild.js'))
      child.on('message', msg => {
        expect(msg).to.equal('test')
        done()
      })
    })
  })
})