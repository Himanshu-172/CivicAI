# CivicAI

CivicAI scaffold using the approved technology stack.

## Services

- `apps/web`: React 19, Vite, TypeScript, Tailwind CSS, shadcn/ui,
  React Router, TanStack Query, Axios, React Hook Form, and Zod
- `apps/api`: Node.js, Express, TypeScript, MongoDB, Mongoose, JWT,
  Socket.io, and Multer
- `apps/ai-service`: Python, FastAPI, YOLOv8, OpenCV, and Ultralytics

No domain features are implemented. Placeholder modules mark intended
boundaries for work after scaffold approval.

## Local Commands

```text
npm install
npm run dev:web
npm run dev:api
uvicorn app.main:app --app-dir apps/ai-service --reload --port 8000
```

The full container scaffold is defined in `infrastructure/docker/compose.yml`.

