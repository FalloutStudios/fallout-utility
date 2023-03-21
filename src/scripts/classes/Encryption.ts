import { CipherGCMTypes, createCipheriv, createDecipheriv, pbkdf2Sync, randomBytes } from 'crypto';

export interface EncryptionOptions {
    secret: string;
    ivLength?: number;
    saltLength?: number;
    pbkdf2Iterations?: number;
    algorithm?: CipherGCMTypes;
    encoding?: BufferEncoding;
}

export interface EncryptionData extends Required<Omit<EncryptionOptions, 'tagLength' | 'ivLength' | 'saltLength'>> {
    encrypted: string;
    decrypted: string;
    iv: string;
    salt: string;
    tag: string;
}

export class Encryption {
    public algorithm: CipherGCMTypes = 'aes-256-gcm';
    public secret: string = randomBytes(16).toString('base64url');
    public encoding: BufferEncoding = 'hex';
    public ivLength: number = 16;
    public saltLength: number = 64;
    public pbkdf2Iterations: number = 100000;

    readonly iv: Buffer;
    readonly salt: Buffer;

    constructor(options?: EncryptionOptions) {
        this.algorithm = options?.algorithm ?? this.algorithm;
        this.secret = options?.secret ?? this.secret;
        this.ivLength = options?.ivLength ?? this.ivLength;
        this.saltLength = options?.saltLength ?? this.ivLength;
        this.pbkdf2Iterations = options?.pbkdf2Iterations ?? this.pbkdf2Iterations;
        this.encoding = options?.encoding ?? this.encoding;

        this.iv = randomBytes(this.ivLength);
        this.salt = randomBytes(this.saltLength);
    }

    public saltSecret(options?: Pick<EncryptionData, 'pbkdf2Iterations'> & { salt?: Buffer; }): Buffer {
        return pbkdf2Sync(this.secret, options?.salt ?? this.salt, options?.pbkdf2Iterations ?? this.pbkdf2Iterations, 32, 'sha512');
    }

    public encrypt(value: string): EncryptionData {
        const key = this.saltSecret();

        const cipher = createCipheriv(this.algorithm, key, this.iv);
        const hash = Buffer.concat([cipher.update(String(value), 'utf-8'), cipher.final()]);

        const tag = cipher.getAuthTag();

        return {
            decrypted: value,
            encrypted: hash.toString(this.encoding),
            secret: this.secret,
            iv: this.iv.toString(this.encoding),
            salt: this.salt.toString(this.encoding),
            tag: tag.toString(this.encoding),
            pbkdf2Iterations: this.pbkdf2Iterations,
            encoding: this.encoding,
            algorithm: this.algorithm,
        };
    }

    public decrypt(options: Omit<Partial<EncryptionData>, 'decrypted' | 'encrypted' | 'secret' | 'tag'> & { encrypted: string; tag: string; }): EncryptionData {
        const encoding = options.encoding ?? this.encoding;
        const iv = options?.iv ? Buffer.from(options.iv, encoding) : this.iv;
        const salt = options?.salt ? Buffer.from(options.salt, encoding): this.salt;
        const tag = Buffer.from(options.tag, encoding);
        const encrypted = Buffer.from(options.encrypted, encoding);
        const key = this.saltSecret({ salt, pbkdf2Iterations: options?.pbkdf2Iterations ?? this.pbkdf2Iterations });

        const decipher = createDecipheriv(options?.algorithm ?? this.algorithm, key, iv);

        decipher.setAuthTag(tag);

        const decrypted = decipher.update(encrypted) + decipher.final('utf-8');

        return {
            decrypted: decrypted,
            encrypted: options.encrypted,
            secret: this.secret,
            iv: iv.toString(encoding),
            salt: salt.toString(encoding),
            tag: options.tag,
            pbkdf2Iterations: options.pbkdf2Iterations ?? this.pbkdf2Iterations,
            encoding,
            algorithm: options.algorithm ?? this.algorithm
        };
    }

    public static encrypt(value: string, secret: string, encoding?: BufferEncoding): string {
        const encrypt = new Encryption({ secret });
        const encrypted = encrypt.encrypt(value);

        return Buffer.from(`${encodeURIComponent(encrypted.salt)} ${encodeURIComponent(encrypted.iv)} ${encodeURIComponent(encrypted.tag)} ${encodeURIComponent(encrypted.encrypted)}`, 'utf-8').toString(encoding ?? 'base64url');
    }

    public static decrypt(encrypted: string, secret: string, encoding?: BufferEncoding): string {
        const data = Buffer.from(encrypted, encoding ?? 'base64url').toString('utf-8').split(' ') as [slat: string, iv: string, tag: string, encrypted: string];

        const encrypt = new Encryption({ secret });
        const decrypted = encrypt.decrypt({
            salt: data[0],
            iv: data[1],
            tag: data[2],
            encrypted: data[3]
        });

        return decrypted.decrypted;
    }
}