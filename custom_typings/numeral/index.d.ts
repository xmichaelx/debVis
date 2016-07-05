interface Numeral {
    language(name: string): void;
    format(pattern: string): string;
}

declare module "numeral" {
    var numeral: (value: number) => Numeral;
    export = numeral;
}