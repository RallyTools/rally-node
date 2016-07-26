import _ from 'lodash';
import refUtils from './ref';

/**
 @module Query

 This module contains utility methods for working with the Rally query syntax
 */

export default class Query {
  constructor(left, op, right) {
    this.left = left;
    this.op = op;
    this.right = right;
  }

  toQueryString() {
    let left = this.left;
    let right = this.right;
    if (left.toQueryString) {
      left = left.toQueryString();
    }

    if (right === null) {
      right = 'null';
    } else if (right.toQueryString) {
      right = right.toQueryString();
    } else if (refUtils.isRef(right)) {
      right = refUtils.getRelative(right);
    } else if (_.isString(right) && right.indexOf(' ') >= 0) {
      right = `"${right}"`;
    }

    return `(${left} ${this.op} ${right})`;
  }

  and(left, op, right) {
    return new Query(this, 'AND', (left instanceof Query) ? left : new Query(left, op, right));
  }

  or(left, op, right) {
    return new Query(this, 'OR', (left instanceof Query) ? left : new Query(left, op, right));
  }
}

export function where(left, op, right) {
  return new Query(left, op, right);
}
