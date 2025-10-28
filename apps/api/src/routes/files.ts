import { Hono } from 'hono';
import { Bindings, User, FileRecord } from '../types';
import { authMiddleware } from '../middleware/auth';
import { requirePermission } from '../middleware/permissions';

const files = new Hono<{ Bindings: Bindings }>();

// Apply auth middleware
files.use('/*', authMiddleware);

// Upload file
files.post('/upload', requirePermission('files', 'create'), async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    const user = c.get('user') as User;
    const fileKey = `${Date.now()}-${crypto.randomUUID()}-${file.name}`;

    // Upload to R2
    await c.env.FILES.put(fileKey, file.stream(), {
      httpMetadata: {
        contentType: file.type,
      },
    });

    // Save metadata to database
    const result = await c.env.DB.prepare(
      `INSERT INTO files (filename, original_filename, file_key, file_size, mime_type, uploaded_by)
       VALUES (?, ?, ?, ?, ?, ?)`
    ).bind(fileKey, file.name, fileKey, file.size, file.type, user.id).run();

    return c.json({
      message: 'File uploaded successfully',
      file: {
        id: result.meta.last_row_id,
        filename: fileKey,
        original_filename: file.name,
        size: file.size,
      }
    }, 201);
  } catch (error) {
    return c.json({ error: 'Failed to upload file' }, 500);
  }
});

// Get all files
files.get('/', requirePermission('files', 'read'), async (c) => {
  try {
    const { results } = await c.env.DB.prepare(
      `SELECT f.*, u.full_name as uploader_name
       FROM files f
       JOIN users u ON f.uploaded_by = u.id
       ORDER BY f.created_at DESC`
    ).all<FileRecord & { uploader_name: string }>();

    return c.json({ files: results });
  } catch (error) {
    return c.json({ error: 'Failed to fetch files' }, 500);
  }
});

// Download file
files.get('/:id/download', requirePermission('files', 'read'), async (c) => {
  try {
    const id = c.req.param('id');

    const fileRecord = await c.env.DB.prepare(
      'SELECT * FROM files WHERE id = ?'
    ).bind(id).first<FileRecord>();

    if (!fileRecord) {
      return c.json({ error: 'File not found' }, 404);
    }

    const file = await c.env.FILES.get(fileRecord.file_key);

    if (!file) {
      return c.json({ error: 'File not found in storage' }, 404);
    }

    return new Response(file.body, {
      headers: {
        'Content-Type': fileRecord.mime_type,
        'Content-Disposition': `attachment; filename="${fileRecord.original_filename}"`,
      },
    });
  } catch (error) {
    return c.json({ error: 'Failed to download file' }, 500);
  }
});

// Delete file
files.delete('/:id', requirePermission('files', 'delete'), async (c) => {
  try {
    const id = c.req.param('id');

    const fileRecord = await c.env.DB.prepare(
      'SELECT * FROM files WHERE id = ?'
    ).bind(id).first<FileRecord>();

    if (!fileRecord) {
      return c.json({ error: 'File not found' }, 404);
    }

    // Delete from R2
    await c.env.FILES.delete(fileRecord.file_key);

    // Delete from database
    await c.env.DB.prepare('DELETE FROM files WHERE id = ?').bind(id).run();

    return c.json({ message: 'File deleted successfully' });
  } catch (error) {
    return c.json({ error: 'Failed to delete file' }, 500);
  }
});

export default files;