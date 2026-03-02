import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const contentDirectory = path.join(process.cwd(), 'content');

export interface MarkdownDocument {
    slug: string;
    title: string;
    date: string;
    description: string;
    content: string;
}

export function getSortedPostsData(category: string): Omit<MarkdownDocument, 'content'>[] {
    const categoryPath = path.join(contentDirectory, category);
    if (!fs.existsSync(categoryPath)) {
        return [];
    }

    const fileNames = fs.readdirSync(categoryPath);
    const allPostsData = fileNames
        .filter(fileName => fileName.endsWith('.md'))
        .map(fileName => {
            const slug = fileName.replace(/\.md$/, '');
            const fullPath = path.join(categoryPath, fileName);
            const fileContents = fs.readFileSync(fullPath, 'utf8');

            const matterResult = matter(fileContents);

            return {
                slug,
                title: matterResult.data.title || slug,
                date: matterResult.data.date || '',
                description: matterResult.data.description || '',
            };
        });

    return allPostsData.sort((a, b) => {
        if (a.date < b.date) {
            return 1;
        } else {
            return -1;
        }
    });
}

export function getPostData(category: string, slug: string): MarkdownDocument {
    const decodedSlug = decodeURIComponent(slug);
    const fullPath = path.join(contentDirectory, category, `${decodedSlug}.md`);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    return {
        slug: decodedSlug,
        title: matterResult.data.title || decodedSlug,
        date: matterResult.data.date || '',
        description: matterResult.data.description || '',
        content: matterResult.content,
    };
}
