export interface MatrixData {
    rows: Array<{
        id: string;
        name: string;
        cells: Array<{
            id: string;
            amount: number;
        }>;
    }>;
    header: string[];
}
