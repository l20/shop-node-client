import * as utils from '@/assets/js/utils.js'
import chai from 'chai'
const expect = chai.expect;

describe('utils.js', () => {
    it('currency 可以输出正确的值', () => {
        expect(utils.currency()).to.be.equal('');
        expect(utils.currency(0)).to.be.equal('$0.00');
        expect(utils.currency(10)).to.be.equal('$10.00');
        expect(utils.currency(10, '￥')).to.be.equal('￥10.00');
    });

    it('isNull 可以判断字符为空', () => {
        expect(utils.isNull('')).to.be.true;
        expect(utils.isNull('hello')).to.be.false;
    });
    
    it('getStrleng 能测试出正确的字符串长度', () => {
        expect(utils.getStrleng()).to.be.equal(0);
        expect(utils.getStrleng(123)).to.be.equal(3);
        expect(utils.getStrleng('hello')).to.be.equal(5);
    });

    it('substring 能截取指定长度字符串,并显示...', () => {
        expect(utils.substring('hello kitty', 5)).to.be.equal('hello ...');
        expect(utils.substring('你好世界', 4)).to.be.equal('你好 ...');
    });

    const KEY = '_KEY';
    it('addData 能在loachStorge中存入一条数据', () => {
        let val = { data: ['hello', 'world', 'kitty'], status: 200};
        expect(utils.addData(KEY, val)).to.not.equal(false);
    });

    it('queryData 能在loachStorge获取一条数据', () => {
        expect(typeof utils.queryData(KEY)).to.be.equal('object');
    });

    it('delData 能在loachStorge删除一条数据', () => {
        expect(utils.delData(KEY)).to.not.equal(false);
        expect(utils.queryData(KEY)).to.be.equal(null);
    });

    it('clearData 能在loachStorge清空所有数据', () => {
        let val = { data: ['hello', 'world', 'kitty'], status: 200};
        utils.addData('key1', val);
        utils.addData('key2', val);
        utils.addData('key3', val);

        expect(utils.clearData(KEY)).to.not.equal(false);
        expect(utils.queryData('key1')).to.be.equal(null);
        expect(utils.queryData('key2')).to.be.equal(null);
        expect(utils.queryData('key3')).to.be.equal(null);
    });

    it('hasProperty 能判断对象中是否存在某属性', () => {
        let obj = { age: 18, name: 'alan', height: 180};
        expect(utils.hasProperty(['age', 'name', 'height'], obj)).to.be.true;
        expect(utils.hasProperty(['hello'], obj)).to.be.false;
    });
})
