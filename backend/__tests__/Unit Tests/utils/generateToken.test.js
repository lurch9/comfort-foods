const jwt = require('jsonwebtoken');
const generateToken = require('../../../utils/generateToken');

jest.mock('jsonwebtoken');

describe('generateToken', () => {
  it('should generate a token with default expiration', () => {
    jwt.sign.mockReturnValue('mockToken');

    const token = generateToken('mockUserId');
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: 'mockUserId' },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );
    expect(token).toBe('mockToken');
  });

  it('should generate a token with custom expiration', () => {
    jwt.sign.mockReturnValue('mockToken');

    const token = generateToken('mockUserId', '1h');
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: 'mockUserId' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    expect(token).toBe('mockToken');
  });

  it('should throw an error if jwt.sign fails', () => {
    jwt.sign.mockImplementation(() => {
      throw new Error('JWT error');
    });

    expect(() => generateToken('mockUserId')).toThrow('JWT error');
  });
});
