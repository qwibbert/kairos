export interface Program {
    id: string;
    title: string;
    courses: CourseRef[]
}

export interface CourseRef {
    id: string,
    semester: Semester,
    program_year: ProgramYear
}

export type Semester = 1 | 2 | 'YEAR' | 'OTHER';
export type ProgramYear = number;